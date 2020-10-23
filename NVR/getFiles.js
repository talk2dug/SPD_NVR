const fs = require('fs');

const moment = require('moment');
var scp = require('scp');
let user = 'jack';
let authpass = 'UUnv9njxg123!!';
let digester = require('http-digest-client')(user, authpass);
let digester2 = require('http-digest-client')(user, authpass);
let digester3 = require('http-digest-client')(user, authpass);
var channelIdentifier = 1;
var now
var start_time
var startedTime
var ffmpegStatus
var recordingStatus = "Not Recording";
var spawn = require('child_process').spawn,
    child = null,
    child2 = null,
    child3 = null,
    child4 = null,
    child5 = null,
    child6 = null,
    child7 = null,
    child8 = null;
setTimeout(function() {
    console.log(ffmpegStatus)
    if (ffmpegStatus === 'stop') {

        ffmpegStatus = 'null'
    }
}, 1000)

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  var videoFiles = "";
  function setNVRTime(){
    var currentDate = moment().format('YYYY-MM-DD%20HH:mm:ss')
    console.log(currentDate)
     digester3.request({
         
        host: '10.10.10.2',
        path: `/cgi-bin/global.cgi?action=setCurrentTime&time=`+currentDate,
        port: 80,
        method: 'GET',
        headers: {
            "Realm": "Login to AMR0138597CD51AC7",
            "keepAliveSocket": true
        }
    }, function(res) {
        //receiving the data stream from the NVR to be saved to file
        res.on('data', function(data) {
            
            console.log(data.toString())
            return "set";
        });
        res.on('error', function(err) {
            console.log('oh no');
        });
        //whent he server send the end header, we then start downloading the next video channel 
        res.on('end', function() {
        })
     });




  }

function getChannelNames(){
    
    digester2.request({
        host: '10.10.10.2',
        path: `/cgi-bin/netApp.cgi?action=getInterfaces`,
        port: 80,
        method: 'GET',
        headers: {
            "Realm": "Login to AMR0138597CD51AC7",
            "keepAliveSocket": true
        }
    }, function(res) {
        //receiving the data stream from the NVR to be saved to file
        res.on('data', function(data) {
            console.log(data.toString())
        });
        res.on('error', function(err) {
            console.log('oh no');
        });
        //whent he server send the end header, we then start downloading the next video channel 
        res.on('end', function() {
        })
      
      
    
    
     });
     
//request.end();





}

function getRTSPfileStream() {
    recordingStatus = "Recording";
     videoFiles = "";
    var fileNameTImeStamp = moment().format("YYYY-MM-DD-HHmm");
    console.log()
    var name1 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name1+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
    
    child = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=1&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name1
    ]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stdout);
    child.on('exit', function() {
        console.log("exited")
    });
    var name2 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name2+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
    console.log(name2)
    child2 = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=2&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name2
    ]);
    child2.stdout.pipe(process.stdout);
    child2.stderr.pipe(process.stdout);
    child2.on('exit', function() {
        console.log("exited")
    });
    var name3 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name3+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
    child3 = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=3&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name3
    ]);
    child3.stdout.pipe(process.stdout);
    child3.stderr.pipe(process.stdout);
    child3.on('exit', function() {
        console.log("exited")
    });
    var name4 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name4+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
    child4 = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=4&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name4
    ]);
    child4.stdout.pipe(process.stdout);
    child4.stderr.pipe(process.stdout);
    child4.on('exit', function() {
        console.log("exited")
    });
    var name5 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name5+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"

    child5 = spawn("ffmpeg", [
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=5&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name5
    ]);
    child5.stdout.pipe(process.stdout);
    child5.stderr.pipe(process.stdout);
    child5.on('exit', function() {
        console.log("exited")
    });
    var name6 = '/mnt/drive/live/' + uuidv4() + ".mp4"
    videoFiles += "{'location':"+ name6+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
    child6=spawn("ffmpeg",[ 
        "-hide_banner", "-loglevel", "panic",
        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=6&subtype=0",
        "-acodec", "copy", "-vcodec", "copy",
        name6
        ]);
        child6.stdout.pipe(process.stdout);
        child6.stderr.pipe(process.stdout);
        child6.on('exit', function () {
        console.log("exited") 
        });
        var name7 = '/mnt/drive/live/' + uuidv4() + ".mp4"
        videoFiles += "{'location':"+ name7+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
        child7=spawn("ffmpeg",[ 
            "-hide_banner", "-loglevel", "panic",
            "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=7&subtype=0",
            "-acodec", "copy", "-vcodec", "copy",
        name7
            ]);
            child7.stdout.pipe(process.stdout);
            child7.stderr.pipe(process.stdout);
            child7.on('exit', function () {
            console.log("exited") 
            });
            var name8 = '/mnt/drive/live/' + uuidv4() + ".mp4"
            videoFiles += "{'location':"+ name8+ ",'date':"+fileNameTImeStamp+",'officer':6661515,'action':'Shots Fired'},\r\n"
            child8=spawn("ffmpeg",[ 
                "-hide_banner", "-loglevel", "panic",
                "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=8&subtype=0",
                "-acodec", "copy", "-vcodec", "copy",
        name8
                ]);
                child8.stdout.pipe(process.stdout);
                child8.stderr.pipe(process.stdout);
                child8.on('exit', function () {
                console.log("exited") 
                
                

})
}
function stopFFMPEG() {
console.log(videoFiles)
                fs.appendFile( "/mnt/drive/data/videoFiles.txt", videoFiles, (err) => {
                    if (err) console.log(err);
                    console.log("Successfully Written Videos to File.");
                  });
    child.kill('SIGINT');
    child2.kill('SIGINT');
    child3.kill('SIGINT');
    child4.kill('SIGINT');
    child5.kill('SIGINT');
    child6.kill('SIGINT');
    child7.kill('SIGINT');
    child8.kill('SIGINT');
    recordingStatus = "Not Recording";
    
    
}

function getFile(channelNumber, downloadTime) {
    channelIdentifier = channelNumber
    startedTime = moment()
    //file_name = COSjUtils.generateFilename()
    now = downloadTime;
    let dStamp = moment().format("YYYY-M-DD");
    let tStamp = moment().startOf('hour');
    let formatT = moment(tStamp).format("HH:mm:ss")
    if (now.minute() < 15) {
        console.log('less 15')
        tStamp = moment(now).startOf('hour').subtract(15, 'minutes');
        start_time = moment(tStamp).format("HH:mm:ss")
        formatT = moment(tStamp).add(15, 'minutes').format("HH:mm:ss")
        console.log(start_time)
    } else if (now.minute() < 30 && now.minute() > 14) {
        console.log('less 30')
        tStamp = moment(now).startOf('hour');
        start_time = moment(tStamp).format("HH:mm:ss")
        formatT = moment(tStamp).add(15, 'minutes').format("HH:mm:ss")
        console.log(start_time)
    } else if (now.minute() < 45 && now.minute() > 31) {
        console.log('less 45')
        tStamp = moment(now).startOf('hour').add(15, 'minutes');
        start_time = moment(tStamp).format("HH:mm:ss")
        formatT = moment(tStamp).add(15, 'minutes').format("HH:mm:ss")
        console.log(start_time)
    } else if (now.minute() <= 59 && now.minute() > 44) {
        console.log('less 59')
        tStamp = moment(now).startOf('hour').add(30, 'minutes');
        start_time = moment(tStamp).format("HH:mm:ss")
        formatT = moment(tStamp).add(15, 'minutes').format("HH:mm:ss")
    } else {
        console.log('else ' + now.minute())
    }


    var uuid = uuidv4()
    var path = ""
    var fileStartTime
    digester.request({
        host: '10.10.10.2',
        path: `/cgi-bin/loadfile.cgi?action=startLoad&channel=` + channelIdentifier + `&startTime=` + dStamp + `%20` + start_time + `&endTime=` + dStamp + `%20` + formatT + `&subtype=0`,
        port: 80,
        method: 'GET',
        headers: {
            "Realm": "Login to AMR0138597CD51AC7",
            "keepAliveSocket": true
        }
    }, function(res) {
        //receiving the data stream from the NVR to be saved to file
        res.on('data', function(data) {
            x = 1
            // specify the path to the file, and create a buffer with characters we want to write
             fileStartTime = moment(tStamp).format("HHmmss")
            //let path = "/home/jack/videos/" + channelIdentifier + "_" + dStamp + "_" + fileStartTime + '.dav';
            // open the file in writing mode, adding a callback function where we do the actual writing
             path = '/mnt/drive/backup/' + uuid + ".dav"
            
            fs.open(path, 'a', function(err, fd) {
                if (err) {
                    throw 'could not open file: ' + err;
                }
                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                fs.write(fd, data, 0, data.length, null, function(err) {
                    if (err) throw 'error writing file: ' + err;
                    fs.close(fd, function() {
                        return ('wrote the file successfully: batch run ');
                    });
                });
            });
        });
        res.on('error', function(err) {
            console.log('oh no');
        });
        //whent he server send the end header, we then start downloading the next video channel 
        res.on('end', function() {
            if (channelIdentifier < 9) {
                copyingStatus = "Coppying";
                var videoFile = "{'location':"+ path+ ",'date':"+dStamp+",'officer':6661515,'action':'Shots Fired', 'channel':"+channelIdentifier+",'startTime':"+  fileStartTime  +"},\r\n"
            fs.appendFile( "/mnt/drive/data/videoBackUp.txt", videoFile, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written Videos to File.");
              });
                channelIdentifier++
                getFile(channelIdentifier, now)

            } else if (channelIdentifier > 8) {
                //just resets the camera counter, sowhen it runs again in 15 min it starts at 1
                copyingStatus = "Dont Copying";
              
                channelIdentifier = 1
            }
        })
    })
}
function getRecordingStatus(){

    return recordingStatus

}
module.exports = {
    getRTSPfileStream,
    getFile,
    stopFFMPEG,
    getChannelNames,
    setNVRTime,
    getRecordingStatus
};

