$(function() {

    

    var html = http://<server>/cgi-bin/ptz.cgi?action=<action>&channel=<ch>&code=<code>&arg1=<arg1>&arg2=<arg2>&arg3=<arg3>
    $('#mainDIV').html("<canvas id='canvas'></canvas>")
    player = new JSMpeg.Player('ws://192.168.196.163:9998', {
          canvas: document.getElementById('canvas') // Canvas should be a canvas DOM element
        })	
    })

    http://admin:UUnv9njxg123@192.168.196.30/cgi-bin/ptz.cgi?action=start&channel=0&code=Up&arg1=0&arg2=1&arg3=0
