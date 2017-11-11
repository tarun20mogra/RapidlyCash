/**
 * Created by tarun on 6/29/2017.
 */
var express = require('express');
var router = express.Router();


/* GET registration page. */
router.get('/', function(req, res, next) {
    console.log("inside getTermsAndCondition.js");
    res.send('../views/termsAndCondition.html');

});

module.exports = router;

