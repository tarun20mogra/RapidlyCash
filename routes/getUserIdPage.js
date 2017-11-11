

var express = require('express');
var router = express.Router();

/* GET registration page. */
router.get('/', function(req, res, next) {
    console.log("inside getUserIdPage.js");
    res.send('../views/getUserId.html');
});

module.exports = router;

