var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var users = require('./routes/users');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(next)
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
var server = app.listen(3001, function() {
    console.log('Listening on port %d', server.address().port);
});


Stream = require('node-rtsp-stream')
stream = new Stream({
    name: 'name',
    streamUrl: 'rtmp://192.168.196.163/live/BodyCam',
    wsPort: 9998,
    ffmpegOptions: { // options ffmpeg flags
       
        "-r": "25"
    }
  })


module.exports = app;