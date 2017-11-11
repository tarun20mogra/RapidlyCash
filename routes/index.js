var express = require('express');
var router = express.Router();

/*---------------- GET index page.---------------- */
router.get('/', function(req, res, next) {
  console.log("inside index.js");
  res.render('rapidly_home.html');
});
/*-----------------Get Registration Page---------------*/
router.get('/views/registration.html', function(req, res, next) {

    res.render('registration.html');
});
/*---------------Get personal information page-----------*/
router.get('/views/personal_information.html', function(req, res, next) {

    res.render('personal_information.html');
});
/*-----------------------get index back----------------------*/
router.get('/views/index.html', function(req, res, next) {

    res.render('index.html');
});
/*----------------------get home page---------------------*/
router.get('/views/rapidly_home.html', function(req, res, next) {

    res.render('rapidly_home.html');
});
/*----------------------get forgot password page---------------------*/
router.get('/views/forgotPassword.html', function(req, res, next) {

    res.render('forgotPassword.html');
});
/*----------------------get Ressset password password page---------------------*/
router.get('/views/getUserId.html', function(req, res, next) {

    res.render('getUserId.html');
});
/*----------------------get Terms and Condition page---------------------*/
router.get('/views/termsAndCondition.html', function(req, res, next) {

    res.render('termsAndCondition.html');
});
/*----------------------get upload_paystub---------------------*/
router.get('/views/upload_paystub.html', function(req, res, next) {

    res.render('upload_paystub.html');
});
/*----------------------get approval page----------------------*/

router.get('/views/loan_approval.html', function(req, res, next) {

    res.render('loan_approval.html');
});

module.exports = router;
