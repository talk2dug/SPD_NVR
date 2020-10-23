var httpUtils = require('./getFiles')
//var SPD_Server = require('socket.io-client')('http://192.168.196.123:3000');
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
d.getDrives(function(err, aDrives) {
        
    for (var i = 0; i < aDrives.length; i++) {
        if(aDrives[i].filesystem==="/dev/sda1"){
            driveMounted = 1;
          
      }
      else{
          driveMounted = 0;}

      }
    
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
io.on("connection", function(socket) {
    
     recordingStatus = getFiles.getRecordingStatus()
    console.log("Recording Status: " + recordingStatus)
    var datestamp = moment();
    getFiles.setNVRTime();
    
    socket.on('loadDrive', function(data) {
        if(driveMounted === 1){
            socket.emit('driveStatus', "Mounted")

        }
        else{
        var exec = require('child_process').exec;
                    exec('mount /dev/sda1 /mnt/drive', function(error, stdout, stderr) {
                      if (error){
                        console.log(error)
                    }
                      // Clock should be set now, exit
                      console.log(stdout);
                      socket.emit('driveStatus', "Mounted")
                      driveMounted ===1;
                      //process.exit();
                    });
                }            
    })
    socket.on('ejectDrive', function(data) {
        console.log(driveMounted)
        if(driveMounted===1){
        var exec = require('child_process').exec;
                    exec('umount /mnt/drive', function(error, stdout, stderr) {
                      if (error) throw error;
                      // Clock should be set now, exit
                      console.log(stdout);
                      driveMounted === 0;
                      socket.emit('driveStatus', "Not Mounted")
                      //process.exit();
                    });
                }
                else{socket.emit('driveStatus', "Mounted")}
    })
    socket.on('getDriveStatus', function(data) {
        var driveMounted = 0;
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
        
        var exec = require('child_process').exec;
        exec('date -s "' + data.time.toString() + '"', function(error, stdout, stderr) {
          if (error) throw error;
          // Clock should be set now, exit
          //console.log("Set time to " + data.time.toString());
          //process.exit();
        });


    })
    //Getting the GPS from the touchscreen PI
    socket.on('gpscarGPS', function(data) {
       
        var exec = require('child_process').exec;
  exec('date -s "' + data.time.toString() + '"', function(error, stdout, stderr) {
    if (error) throw error;
    // Clock should be set now, exit
    //console.log("Set time to " + data.time.toString());
    //process.exit();
  });
        var gpsData = JSON.stringify(data)
        gpsData += "\r\n"
        fs.appendFile( "/mnt/drive/data/gps.txt", gpsData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written GPS to File.");
        });
         //console.log(data)
    })
    //Here is where we listen for socket calls and perform actions based on the data
    socket.on('bodyCamgps', function(data) {
       
    })
    socket.on('officerStatus', function(data) {

            console.log(data)
            var officerStatusData = JSON.stringify(data)
            officerStatusData += "\r\n"
        fs.appendFile( "/mnt/drive/data/officerStatusData.txt", officerStatusData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written Officer to File.");
        });

    })
    
    socket.on('action', function(data) {
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
                    datestamp = moment()
                    downloadFiles()
                    io.emit("bodyCam", "START")
                 
                 
                    break;
                case 'endcall':
                    console.log('end caaaal')
                    datestamp = moment()
                    endCallClicked = true
                    io.emit("bodyCam", "STOP")
                    httpUtils.stopFFMPEG()
                    break;
                case 'download':
                    //setTimeout(function(){
                    transferFiles()
                    console.log("End Shift")
                    break;
                default:
        }
    })
});

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