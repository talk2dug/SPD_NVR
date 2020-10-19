var httpUtils = require('./getFiles')
var SPD_Server = require('socket.io-client')('http://192.168.196.123:3000');
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

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
var db;
var badgeNumber = "123456789";
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
    var fileNameDate = moment().format("YYYY-MM-DD");
    var dirName = "/mnt/drive/" + fileNameDate
    var spawn = require('child_process').spawn,
    child = null,
    child2 = null;

    child = spawn("/opt/nodejs/bin/copyfiles", [
        "/home/jack/videos/*.dav", dirName
       
    ]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stdout);
    child.on('exit', function() {
        console.log("exited")
        child2 = spawn("/opt/nodejs/bin/copyfiles", [
            "/home/jack/videos/*.mp4", dirName
           
        ]);
        child2.stdout.pipe(process.stdout);
        child2.stderr.pipe(process.stdout);
        child2.on('exit', function() {
            console.log("2 exited")
        });
    });



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

io.on("connection", function(socket) {
    var datestamp = moment();
    //Getting the GPS from the touchscreen PI
    socket.on('gpscarGPS', function(data) {
        SPD_Server.emit('gpscarGPS', data)
        var gpsData = JSON.stringify(data)
        gpsData += "\r\n"
        fs.appendFile( "/mnt/drive/gps.txt", gpsData, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written GPS to File.");
          });
          
         console.log(data)
        })
    //Here is where we listen for socket calls and perform actions based on the data
    socket.on('bodyCamgps', function(data) {
        SPD_Server.emit('bodyCamGPS', data)
    })
    socket.on('badgeNumber', function(data) {
        badgeNumber = data;
            console.log(data)
            var user = {"badgeNumber":data,
                            "date":  datestamp         
            }
            const officerInfo = JSON.stringify(user);
            fs.writeFile("/mnt/drive/temp.txt", officerInfo, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
              insertDocuments(db,data, function() {
                console.log("DUN")
              });

    })
    socket.on('action', function(data) {
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
                case 'startCall':
                    datestamp = moment()
                    downloadFiles()
                    io.emit("bodyCam", "START")
                 
                 
                    break;
                case 'endCall':
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

function getBadgeNumber(){

    return badgeNumber
}
socketApi.io = io;
module.exports = socketApi;