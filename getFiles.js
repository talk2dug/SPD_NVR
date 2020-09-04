const fs = require('fs');
//const COSjUtils = require('./public/javascripts/jacksCode');
const moment = require('moment');
let user = 'jack';
let authpass = 'UUnv9njxg123!!';
let digester = require('http-digest-client')(user, authpass);
var channelIdentifier = 1;
var now
var startedTime
var ffmpegStatus
var spawn=require('child_process').spawn
, child=null,
child2=null,
child3=null,
child4=null,
child5=null,
child6=null,
child7=null,
child8=null;
setTimeout(function() {
    console.log(ffmpegStatus)
    if(ffmpegStatus === 'stop'){
    
    ffmpegStatus = 'null'
    }
  }, 1000)
function getRTSPfileStream(){
    

    
        child=spawn("ffmpeg",[ 
            "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=1&subtype=0",
            "-c", "copy", 
            "-map", "0", 
            "-f", "segment", 
            "-segment_time", "300", 
            "-segment_format", "mp4", 
            "/home/jack/videos/capture-%03d.mp4"
            ]);
            //child.stdout.pipe(process.stdout);
            //child.stderr.pipe(process.stdout);
            child.on('exit', function () {
            console.log("exited") 
            });
    
            child2=spawn("ffmpeg",[ 
                "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=2&subtype=0",
                "-c", "copy", 
                "-map", "0", 
                "-f", "segment", 
                "-segment_time", "300", 
                "-segment_format", "mp4", 
                "/home/jack/videos/capture2-%03d.mp4"
                ]);
                //child2.stdout.pipe(process.stdout);
                //child2.stderr.pipe(process.stdout);
                child2.on('exit', function () {
                console.log("exited") 
                });
                child3=spawn("ffmpeg",[ 
                    "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=3&subtype=0",
                    "-c", "copy", 
                    "-map", "0", 
                    "-f", "segment", 
                    "-segment_time", "300", 
                    "-segment_format", "mp4", 
                    "/home/jack/videos/capture3-%03d.mp4"
                    ]);
                    //child3.stdout.pipe(process.stdout);
                    //child3.stderr.pipe(process.stdout);
                    child3.on('exit', function () {
                    console.log("exited") 
                    });
                    child4=spawn("ffmpeg",[ 
                        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=4&subtype=0",
                        "-c", "copy", 
                        "-map", "0", 
                        "-f", "segment", 
                        "-segment_time", "300", 
                        "-segment_format", "mp4", 
                        "/home/jack/videos/capture4-%03d.mp4"
                        ]);
                        //child4.stdout.pipe(process.stdout);
                        //child4.stderr.pipe(process.stdout);
                        child4.on('exit', function () {
                        console.log("exited") 
                        });
                        child5=spawn("ffmpeg",[ 
                            "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=5&subtype=0",
                            "-c", "copy", 
                            "-map", "0", 
                            "-f", "segment", 
                            "-segment_time", "300", 
                            "-segment_format", "mp4", 
                            "/home/jack/videos/capture5-%03d.mp4"
                            ]);
                            //child5.stdout.pipe(process.stdout);
                            //child5.stderr.pipe(process.stdout);
                            child5.on('exit', function () {
                            console.log("exited") 
                            });
                            /*
                            child6=spawn("ffmpeg",[ 
                                "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=6&subtype=0",
                                "-c", "copy", 
                                "-map", "0", 
                                "-f", "segment", 
                                "-segment_time", "300", 
                                "-segment_format", "mp4", 
                                "/home/jack/videos/capture6-%03d.mp4"
                                ]);
                                child6.stdout.pipe(process.stdout);
                                child6.stderr.pipe(process.stdout);
                                child6.on('exit', function () {
                                console.log("exited") 
                                });
                                child7=spawn("ffmpeg",[ 
                                    "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=7&subtype=0",
                                    "-c", "copy", 
                                    "-map", "0", 
                                    "-f", "segment", 
                                    "-segment_time", "300", 
                                    "-segment_format", "mp4", 
                                    "/home/jack/videos/capture7-%03d.mp4"
                                    ]);
                                    child7.stdout.pipe(process.stdout);
                                    child7.stderr.pipe(process.stdout);
                                    child7.on('exit', function () {
                                    console.log("exited") 
                                    });
                                    child8=spawn("ffmpeg",[ 
                                        "-i", "rtsp://jack:UUnv9njxg123!!@10.10.10.2:554/cam/realmonitor?channel=8&subtype=0",
                                        "-c", "copy", 
                                        "-map", "0", 
                                        "-f", "segment", 
                                        "-segment_time", "300", 
                                        "-segment_format", "mp4", 
                                        "/home/jack/videos/capture8-%03d.mp4"
                                        ]);
                                        child8.stdout.pipe(process.stdout);
                                        child8.stderr.pipe(process.stdout);
                                        child8.on('exit', function () {
                                        console.log("exited") 
                                        });
                                        */
                                        
                                    

}

function stopFFMPEG(){
    child.kill('SIGINT');
    child2.kill('SIGINT');
    child3.kill('SIGINT');
    child4.kill('SIGINT');
    child5.kill('SIGINT');
    //child6.kill('SIGINT');
    //child7.kill('SIGINT');
    //child8.kill('SIGINT');




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
        console.log('else ' +now.minute())
    }
    //this is where the call to the NVR is made
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
            let path = "../videos/" + channelIdentifier + "-" + dStamp + "_" + start_time + '.dav';
            // open the file in writing mode, adding a callback function where we do the actual writing
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
            console.log('oh noes');
        });
        //whent he server send the end header, we then start downloading the next video channel 
        res.on('end', function() {
            
            if (channelIdentifier < 9) {
                channelIdentifier++
                getFile(channelIdentifier, now)
            } else if (channelIdentifier > 8) {
                //just resets the camera counter, sowhen it runs again in 15 min it starts at 1
                channelIdentifier = 1
            }
        })
    })
}
module.exports = {
    getRTSPfileStream,
    getFile,
 stopFFMPEG

};