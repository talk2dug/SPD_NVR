var express = require('express');
var router = express.Router();
var http = require('http');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var $
var moment = require('moment');

const url = 'mongodb://localhost:27017';
var db;
var badgeNumber = "123456789";
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
   
     db = client.db('SPDNVR');
   
    
  });


router.get('/getofficers', function(req, res) {
    const collection = db.collection('officerInfo');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
          assert.equal(err, null);
          console.log(docs.length);
          //console.log(docs)
          for(var i=0; i<docs.length;i++){
                console.log(docs[i].badgeNumber)


          }
          res.json(docs)
        });
});
router.post('/addOfficer', function(req, res) {
    var item = new pcData(requested);
    item['badgeNumber'] = req.badgeNumber;
    item['badgeNumber'] = req.date;
    item.save();
    res.status(200).end()
});

module.exports = router;
