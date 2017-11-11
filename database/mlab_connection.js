/**
 * Created by tarun on 6/22/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var express = require('express');
var app = express();
var db ;
MongoClient.connect('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax',function (err, database) {
    if (err) return console.log(err);
    db = database;
    app.listen(3005, function() {
        console.log('listening on 3005');
    })
}) ;