/**
 * Created by tarun on 6/27/2017.
 */

var express = require('express');
var router = express.Router();

/* GET registration page. */
router.get('/', function(req, res, next) {
    console.log("inside getForgetPassword.js");
    console.log(req.body);
    res.send('../views/forgotPassword.html');
});

module.exports = router;

