var httpUtils = require('./getFiles')
var SPD_TouchScreen = require('socket.io-client')('http://10.10.10.5:3000');
var socket_io = require('socket.io');
const moment = require('moment')
var io = socket_io();
var socketApi = {};
var alert = {}
let timestamp = {}
var os = require('os');
var ifaces = os.networkInterfaces();
const fs = require('fs');
const assert = require('assert');
const getFiles = require('./getFiles');
var driveMounted;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
var db;
var badgeNumber = "123456789";
var d = require('diskinfo');
const { spawn } = require("child_process");
d.getDrives(function(err, aDrives) {
        
    for (var i = 0; i < aDrives.length; i++) {
        if(aDrives[i].filesystem==="/dev/sda1"){
            driveMounted = 1;
          
      }
      else{
          driveMounted = 0;}

      }
    
});
var geolib = require('geolib');
var GPS = require('./node_modules/gps/gps.js');
var gps = new GPS;
const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyS0', {
    baudRate: 9600
})
const Readline = require('@serialport/parser-readline');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var touchScreen = require('socket.io-client')('http://10.10.10.5:3000');
// Open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message)
})
var gpsLOG = 0;




var prevLAT
var prevLON
var GPSarray = {}
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', function(data) {
    gps.update(data);
    //parseGPS(gps);
})
function calculateHeading(lon, lat) {
    var Heading = 0;
    var angles = require('angles');
    Heading = GPS.Heading(prevLAT, prevLAT, lat, lon);
    Heading = Heading.toFixed(0)
    prevLAT = lat;
    prevLON = lon;
    return Heading;
}
gps.on('state', function(data){
    

})
var gpsData
io.on("connection", function(socket) {
gps.on('GGA', function(data) {
    //console.log(data)
    var headingDir = calculateHeading(data.lon, data.lat)
    GPSarray['lon'] = data.lon
    GPSarray['lat'] = data.lat
    GPSarray['heading'] = headingDir
    if (gps.state.speed != null) {GPSarray['speed'] = gps.state.speed.toFixed(2)}
    if (gps.state.speed == null) {GPSarray['speed'] = 0}
		GPSarray['time'] = data.time
		if (data.lon === null) {
		var pos = {'lon': '-76.558225','lat': '38.06033333333333'}
    } else {
        var pos = {'lon': data.lon,'lat': data.lat}
    }
    headingDir = calculateHeading(gps.state.lon, gps.state.lat)
    gpsData ={"lon": gps.state.lon,
    "lat": gps.state.lat,
    "heading":headingDir,
    "satsActive":data.satellites,
    "alt":gps.state.alt,
    "time":data.time,
    "quality":data.quality,
    "speed":gps.state.speed}
    io.emit('state', gpsData)
    touchScreen.emit('gpsData', gpsData)
    if(gpsLOG===1){

        console.log(moment(gpsData.time).format("h-mm", true))
        var day = moment(gpsData.time).format("MMDDyyyy", true)
        var time = moment(gpsData.time).format("hhmm", true)
        var logfileTimeStamp = day +"-"+ time
        
         console.log(logfileTimeStamp)
        gpsData = JSON.stringify(gpsData)
        gpsData += "\r\n"
        fs.appendFile( "/mnt/drive/data/GPS-"+day+".txt", gpsData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written GPS to File.");
        });
    
    }
  
    
    io.emit('recordingStatus', getFiles.getRecordingStatus())
        
        var exec = require('child_process').exec;
        exec('date -s "' + data.time.toString() + '"', function(error, stdout, stderr) {
          if (error) throw error;
          // Clock should be set now, exit
          //console.log("Set time to " + data.time.toString());
          //process.exit();
        });
});

MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
   
     db = client.db('SPDNVR');
   
    
  });
const insertDocuments = function(db, badgeNum, callback) {
    var date = moment();
    // Get the documents collection
    const collection = db.collection('officerInfo');
    // Insert some documents
    collection.insert([
      {"badgeNumber" : badgeNum, "date":date}
    ], function(err, result) {
      console.log(result)
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }


require('events').EventEmitter.prototype._maxListeners = 100;
var timeoutID;
var endCallClicked = false
//Function to stop timer job
function clearAlert() {
    clearTimeout(timeoutID);
}
//This is the function that initiates the downloading of the files from the NVR

function transferFiles(){
    



}

function downloadFiles() {
    httpUtils.getRTSPfileStream()
    httpUtils.getFile(1, moment())
    //Then runs every 15 min until time job stopped
    timeoutID = setTimeout(function() {
        httpUtils.getFile(1, moment())
        //here is we check to see if the flag "end call" has been clicked. If its true we stop the timer job
        if (endCallClicked) {
            clearAlert();
        }
    }, 900000)
}
var recordingStatus = "Not Recording"
var copyingStatus =""
    
     recordingStatus = getFiles.getRecordingStatus()
    console.log("Recording Status: " + recordingStatus)

   

    
    copyingStatus = getFiles.getcopyingStatus()
    console.log("Copying Status: " + copyingStatus)

    var datestamp = moment();
    getFiles.setNVRTime();
    
    socket.on('loadDrive', function(data) {
        if(driveMounted === 1){
            socket.emit('driveStatus', "Mounted")
            socket.emit('copyingStatus',copyingStatus)
        }
        else{
            
            const ls = spawn("mount", ["/dev/sda1", "/mnt/drive"]);
            ls.stdout.on("data", data => {
                console.log(`stdout: ${data}`);
                socket.emit('driveStatus', "Mounted")
                driveMounted = 1;
            });
            
            ls.stderr.on("data", data => {
                console.log(`stderr: ${data}`);
                socket.emit('driveStatus', "Not Mounted")
                driveMounted = 0;
            });
            
            ls.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });
            
            ls.on("close", code => {
                console.log(`child process exited with code ${code}`);
                socket.emit('driveStatus', "Mounted")
            });
                         
        }
    })
    socket.on('ejectDrive', function(data) {
        copyingStatus = getFiles.getcopyingStatus()
        console.log(driveMounted)
        socket.emit('copyingStatus',copyingStatus)
        if(copyingStatus==="Coppying"){
            socket.emit('copyingStatus', "Copying")


        }
        if(copyingStatus==="Not Coppying"){
            const ls2 = spawn("umount", ["/mnt/drive"]);
            ls2.stdout.on("data", data => {
                console.log(`stdout: ${data}`);
                socket.emit('driveStatus', "Not Mounted")
                driveMounted = 0;
            });
            
            ls2.stderr.on("data", data => {
                console.log(`stderr: ${data}`);
            });
            
            ls2.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });
            
            ls2.on("close", code => {
                console.log(`child process exited with code ${code}`);
                socket.emit('driveStatus', "Not Mounted")
                driveMounted = 0;
            });
        }
               

    })
    socket.on('getDriveStatus', function(data) {
        copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
        d.getDrives(function(err, aDrives) {
        
              for (var i = 0; i < aDrives.length; i++) {
                  if(aDrives[i].filesystem==="/dev/sda1"){
                      
                      socket.emit('driveStatus', "Mounted")
                    
                }
                else{
                    //socket.emit('driveStatus', "Not Mounted")
                    }
        
                }
                
        });
    })
    socket.on('state', function(data) {
        
        socket.emit('recordingStatus', getFiles.getRecordingStatus())
        copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
        var exec = require('child_process').exec;
        exec('date -s "' + data.time.toString() + '"', function(error, stdout, stderr) {
          if (error) throw error;
          // Clock should be set now, exit
          //console.log("Set time to " + data.time.toString());
          //process.exit();
        });


    })
    //Getting the GPS from the touchscreen PI
  
        
         //console.log(data)
    
    //Here is where we listen for socket calls and perform actions based on the data
    socket.on('bodyCamgps', function(data) {
       
    })
    socket.on('officerStatus', function(data) {
        var gpsPacket = getFiles.getGPSPacket()
        copyingStatus = getFiles.getcopyingStatus()
        var officerData = data;
        officerData.gpsPacket = gpsPacket
        socket.emit('copyingStatus',copyingStatus)
            console.log(data)
            var officerStatusData = JSON.stringify(data)
            officerStatusData += "\n"
        fs.appendFile( "/mnt/drive/data/officerStatusData.txt", officerStatusData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written Officer to File.");
            getFiles.setOfficerInfo(data)

        });

    })
    
    socket.on('action', function(data) {
        copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
        console.log(data)
        switch (data) {
            //case 'signIn':
             // 
             //   if (piUtils.isCardMounted() === true) {
              //      console.log('SD card mounted')
             //       //offTable = fs.readFileSync('officer.json');
             //       //let officer = offTable.find(el => el.name === data.name)
             //       //officer.badgenum
             //       break;
            //    } else {
             //       alert.type = "No drive mounted"
              //      io.emit('driveAlert', alert)
              //      break;
             //   }
             
                case 'startcall':
                    copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
                    datestamp = moment()
                    downloadFiles()
                    io.emit("bodyCam", "START")
                    gpsLOG = 1;
                 
                    break;
                case 'endcall':
                    copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
                    console.log('end caaaal')
                    datestamp = moment()
                    endCallClicked = true
                    io.emit("bodyCam", "STOP")
                    httpUtils.stopFFMPEG()
                    gpsLOG = 0;
                    break;
                case 'download':
                    copyingStatus = getFiles.getcopyingStatus()
        socket.emit('copyingStatus',copyingStatus)
                    //setTimeout(function(){
                    transferFiles()
                    console.log("End Shift")
                    break;
                default:
        }
    
});
})
//var ncp = require('ncp').ncp;

                //ncp.limit = 16;

               // ncp('/home/jack/videos/', '/mnt/drive/', function(err) {
                 //   if (err) {
                //        return console.error(err);
                //    }
              //   //   console.log('done!');
              //  });


socketApi.io = io;
module.exports = socketApi;