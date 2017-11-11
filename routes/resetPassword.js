/**
 * Created by tarun on 6/27/2017.
 */

var express = require('express');
var router = express.Router();
var CryptoJS = require('crypto-js');
var ciphertext;
var mongo = require('mongoskin');
ObjectId = require('mongodb').ObjectID;
db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');

/* GET registration page. */
router.post('/', function(req, res, next) {
    console.log("inside resetPassword.js");
    console.log(req.body);
    var collection = db.collection("registration_info");
    ciphertext = CryptoJS.AES.encrypt(req.body.password, 'rapidlyTax100');
    console.log("encrypted password"+ciphertext);
    req.body.password = ciphertext.toString();
    collection.findOne({_id: req.body.userId}, function (err, data) {
        if(err){
            console.log("error");
        }
        else if (data == null){
            console.log("inside no data found module");
            res.json({data : "No Such Account"})
        }
        else{
            collection.updateOne({_id : req.body.userId},{$set:{password : req.body.password}}, function (err, data) {
                if (err){
                    console.log(err);
                }
                else {
                    console.log("found the data");
                    res.json({data: "valid user"})
                }
            });

        }
    });

});

module.exports = router;

