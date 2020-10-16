$(function() {
$('#mainDIV').html("<canvas id='canvas'></canvas>")
player = new JSMpeg.Player('ws://192.168.196.163:9998', {
      canvas: document.getElementById('canvas') // Canvas should be a canvas DOM element
    })	
})