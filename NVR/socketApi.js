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
const mongoose = require('mongoose');
 //mongoose.connect('mongodb://192.168.196.123:27017/NVR', {

//});
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
    var datestamp = "";
    //Getting the GPS from the touchscreen PI
    socket.on('gpscarGPS', function(data) {
        SPD_Server.emit('gpscarGPS', data)
    })
    //Here is where we listen for socket calls and perform actions based on the data
    socket.on('bodyCamgps', function(data) {
        SPD_Server.emit('bodyCamGPS', data)
    })
    
    socket.on('action', function(data) {
        switch (data) {
            case 'signIn':
                if (piUtils.isCardMounted() === true) {
                    console.log('SD card mounted')
                    //offTable = fs.readFileSync('officer.json');
                    //let officer = offTable.find(el => el.name === data.name)
                    //officer.badgenum
                    break;
                } else {
                    alert.type = "No drive mounted"
                    io.emit('driveAlert', alert)
                    break;
                }
                case 'startCall':
                    datestamp = moment()
                    downloadFiles()
                    io.emit("bodyCam", "START")
                    Stream = require('node-rtsp-stream')
                    setTimeout(() => {
stream = new Stream({
    name: 'name',
    streamUrl: 'rtmp://192.168.196.163/live/bodyCam',
    wsPort: 9998,
    ffmpegOptions: { // options ffmpeg flags
       
        "-r": "25"
    }
  })
}, 5000);
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
socketApi.io = io;
module.exports = socketApi;