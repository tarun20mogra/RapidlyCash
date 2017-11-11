var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongo = require('mongoskin');
var nodemailer = require('nodemailer');
var cryptoJS = require('crypto');
var multer = require('multer');
var fs =require('fs');
var plaid = require('plaid');
var envvar = require('envvar');
db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');
var index = require('./routes/index');
var users = require('./routes/users');
var callRegistrationPage = require('./routes/callRegistrationPage');
var submitRegistration = require('./routes/submitRegistration');
var getIndex = require('./routes/getIndex');
var getHome = require('./routes/getHome');
var forgotPassword = require('./routes/getForgotPassword');
var resetPassword = require('./routes/resetPassword');
var getUserIdPage = require('./routes/getUserIdPage');
var submitForm = require('./routes/submitForm');
var termsAndCondition = require('./routes/getTermsAndCondition');
var logoutToHome = require('./routes/logoutToHome');
var getUserId = require('./routes/getUserId');
var uploadPaystub = require('./routes/uploadPaystub');
var get_access_token = require('./routes/get_access_token');
var app = express();


//setting up the plaid credentials
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID','58e805884e95b819440e550b');
var PLAID_SECRET = envvar.string('PLAID_SECRET','26eabbce8734b1fbb28e3b696c86ff');
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY','2a0023a032da393380f0c02941b814');
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

// Initialize the Plaid client
var client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV]
);




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var sess;
const url = require('url');


app.use('/', index);
app.use('/users', users);
app.use('/callRegistrationpage',callRegistrationPage);
app.use('/submitRegistration', submitRegistration);
app.use('/getIndex',getIndex);
app.use('/getHome',getHome);
app.use('/getForgotPassword', forgotPassword);
app.use('/resetPassword', resetPassword);
app.use('/getUserIdPage', getUserIdPage);
app.use('/submitForm',submitForm);
app.use('/getTermsAndCondition',termsAndCondition);
app.use('/logoutToHome', logoutToHome);
app.use('/getUserId',getUserId);
app.use('/uploadPaystub',uploadPaystub);
app.use('/get_access_token', get_access_token);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  //Database

});




module.exports = app;
