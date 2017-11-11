var express = require('express');
var router = express.Router();
var envvar = require('envvar');
var plaid = require('plaid');
var moment = require('moment');
var mongo = require('mongoskin');
var helper = require('sendgrid').mail;
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID','58e805884e95b819440e550b');
var PLAID_SECRET = envvar.string('PLAID_SECRET','26eabbce8734b1fbb28e3b696c86ff');
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY','2a0023a032da393380f0c02941b814');
var PLAID_ENV = envvar.string('PLAID_ENV', 'sandbox');
var account_info;
var account_number;
var bank_info;
var from_email = new helper.Email('info@rapidly.co');
var to_email = new helper.Email('info@rapidly.co');
var subject = 'Loan Request authentication';
ObjectId = require('mongodb').ObjectID;
db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');


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
router.get('/', function(request, response, next) {
    response.json({
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV
    });
});
router.post('/', function(req, res, next) {
    var bank_information_plaid_collection = db.collection ("Bank_Information_Plaid");
    console.log("inside the plaid api get access token");
    PUBLIC_TOKEN = req.body.publicToken;
    console.log(PUBLIC_TOKEN);
    client.exchangePublicToken(PUBLIC_TOKEN, function(error, tokenResponse) {
        if (error != null) {
            var msg = 'Could not exchange public_token!';
            console.log(msg + '\n' + error);
            return res.json({
                error: msg
            });
        }
        ACCESS_TOKEN = tokenResponse.access_token;
        ITEM_ID = tokenResponse.item_id;
        console.log('Access Token: ' + ACCESS_TOKEN);
        console.log('Item ID: ' + ITEM_ID);
        /*-----------------Getting the account information-------------------*/
        client.getAuth(ACCESS_TOKEN, function(error, authResponse) {
            if (error != null) {
                var msg = 'Unable to pull accounts from the Plaid API.';
                console.log(msg + '\n' + error);
            }
            console.log("----------------------------------------------------------");
            console.log(authResponse.accounts);
            account_info = authResponse.accounts;
            console.log("----------------------------------------------------------");
            console.log(authResponse.numbers);
            account_number = authResponse.numbers;



            bank_information_plaid_collection.insertOne({_id : req.body._id , account_information : account_info , acoount_number_info : account_number , bank_information  : bank_info}, function (err,data) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("saved to database")
                }
            });

        });

        /*-----------------------getting the item information------------------*/
        client.getItem(ACCESS_TOKEN, function(error, itemResponse) {
            if (error != null) {
                console.log(JSON.stringify(error));
            }

            // Also pull information about the institution
            client.getInstitutionById(itemResponse.item.institution_id, function(err, instRes) {
                if (err != null) {
                    var msg = 'Unable to pull institution information from the Plaid API.';
                    console.log(msg + '\n' + error);
                } else {
                        console.log("inside getting the item information");
                        console.log(itemResponse.item);
                        console.log(instRes.institution);
                        bank_info = instRes.institution;
                        console.log("-------------------Printing for the mail-------------------");
                        console.log(bank_info);
                }
            });
        });
        //sending the email
        var content = new helper.Content('text/plain', req.body._id + 'just got authenticated from plaid. Check the database');
        var mail = new helper.Mail(from_email, subject, to_email, content);
        var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        });

        sg.API(request, function(error, response) {
                if(error){
                    console.log("There is some error : " + error);
                }
                else{
                    console.log("mail sent");
                    console.log(response);
                }
        });
        res.json({
            'error': false
        });
    });


});

module.exports = router;


