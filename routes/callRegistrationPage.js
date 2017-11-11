/**
 * Created by tarun on 6/16/2017.
 */
var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');

/* GET registration page. */
router.get('/', function(req, res, next) {
    console.log("inside callRegistrationPage.js");
    res.send('../views/registration.html');
});

module.exports = router;

