
var express = require('express');
var CryptoJS = require('crypto-js');
var router = express.Router();
var mongo = require('mongoskin');
ObjectId = require('mongodb').ObjectID;

db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');


/* GET registration page. */
router.post('/', function(req, res, next) {
    console.log("inside getHome.js");

    var loan_amount_collection = db.collection("loan_amount_info");
    var persona_info_collection = db.collection("personal_info");
    var collection = db.collection("registration_info");
    collection.findOne({_id: req.body._id},function (err, data) {
            console.log("entered function CheckUser");
            // console.log(req);

            if (err) {
                console.log("entered if");
                res.json({"data":"failed" + err});
                console.log(err);
            }
            else if (data==null ||data.length == 0) {
                console.log("entered else if");
                //res.json(err);
                res.json({"data":"Empty Data"});
            }
            else {
                var decrypt  = CryptoJS.AES.decrypt(data.password.toString(), 'rapidlyTax100');
                var plaintext = decrypt.toString(CryptoJS.enc.Utf8);
                console.log(plaintext);
                if(req.body.password == plaintext){
                    console.log("entered else");

                    persona_info_collection.findOne({_id: req.body._id} , function (err,data) {
                       if(err){
                           console.log(err);
                       }
                       else if (data == null){
                           res.json({"data":"no personal info"});
                       }
                       else {
                           res.json({"data": "personal info valid"});
                       }

                    });



                }
               else {
                    res.json({"data":"Empty Data"});
                }
            }

        });

});

module.exports = router;

