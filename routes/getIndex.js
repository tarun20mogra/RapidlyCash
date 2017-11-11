
var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
ObjectId = require('mongodb').ObjectID;

db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');

router.post('/', function(req, res, next) {
    console.log("inside getIndex.js");
    console.log(req.body);
    var collection = db.collection("personal_info");
    collection.insertOne(req.body , function (err,data) {
        if(err){
            console.log(err);
            res.send({data : "error"});
        }
        else{
            res.json({data : "saved to database"});
        }
    });
});

module.exports = router;

