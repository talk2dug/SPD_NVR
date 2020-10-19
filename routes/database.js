var express = require('express');
var router = express.Router();
var http = require('http');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var $
var moment = require('moment');
require("jsdom").env("", function(err, window) {
    if (err) {
        return;
    }

    $ = require("jquery")(window);
});

var officerInfo = require('../schemas/officerInfo');


router.get('/getofficers', function(req, res) {
    officerInfo.find({}, function(err, officers) {
        res.json(officers);
        console.log(officers)
    })
});


module.exports = router;