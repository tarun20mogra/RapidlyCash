var express = require('express');
var router = express.Router();
var CryptoJS = require('crypto-js');
var ciphertext;
var mongo = require('mongoskin');
ObjectId = require('mongodb').ObjectID;
db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');
/* GET registration page. */
router.post('/', function(req, res, next) {
    console.log("inside submitRegistration.js");
    console.log(req.body);
    ciphertext = CryptoJS.AES.encrypt(req.body.password, 'rapidlyTax100');
    console.log("encrypted password"+ciphertext);
    req.body.password = ciphertext.toString();

    //saving to database
   var collection = db.collection('registration_info');
   collection.findOne({email_id : req.body.email_id} , function (err, data) {
      if (data == null){
          collection.findOne({_id : req.body._id},function (err, data) {
              console.log("entered function");
              console.log(data);
              if (data === null) {
                  collection.insertOne(req.body, function (err, result) {
                      console.log("entered databse");
                      if (err){
                          console.log(err);
                          return (err);

                      }

                      else {
                          console.log("data saved to database");
                          res.json({"data": "saved to database"});

                      }
                  })
              }
              else {
                  console.log("entered else if");
                  //res.json(err);
                  res.json({"data": "data exist"});
              }
          })

      }
      else {
          res.json({"data" : "email exist"});
      }
   });

    });

module.exports = router;

