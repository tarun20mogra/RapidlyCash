var express = require('express');
var router = express.Router();
var mongo = require('mongoskin');
var nodemailer = require('nodemailer');
var helper = require('sendgrid').mail;
var from_email = new helper.Email('info@rapidly.co');
var to_email = new helper.Email('info@rapidly.co');
var subject = 'Loan Request';



ObjectId = require('mongodb').ObjectID;

db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');

/* GET registration page. */
router.post('/', function(req, res, next) {

    var amount_collection = db.collection ("loan_amount_info");
    var collection = db.collection("registration_info");
    var personal_info_collection = db.collection("personal_info");
    var registration_info = collection.findOne({_id : req.body._id}, function (err, data) {
        if (err){
            console.log(err);
        }
        else
        {
            console.log("data found");
            console.log(data.email_id.toString());
            req.body.email = data.email_id.toString();

        }

    });
    var personal_info = personal_info_collection.findOne({_id : req.body._id}, function (err, data) {
        if (err){
            console.log(err);
        }
        else
        {
            console.log("data found");
            req.body.name = data.name.toString();
            req.body.phone = data.phone.toString();
            req.body.employer_phone = data.employer_phone.toString();
            res.json({data : "done"});
            //sending the email
           var content = new helper.Content('text/plain', '\nCustomer email address : ' + req.body.email + '\nCustomer User ID :' + req.body._id +
            '\nCustomer name : ' + req.body.name + '\nCustomer phone number : ' + req.body.phone +  '\nEmployer Phone number :' +req.body.employer_phone
            + '\nAmount requested for loan :' + req.body.amount + '\nReqired thier loan : ' + req.body.requiredTimeForLoan);
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
         //saving the loan amount information to databse
            amount_collection.insertOne({_id : req.body._id , Loan_amount_requested : req.body.amount , Required_thier_loan : req.body.requiredTimeForLoan , Total_payback_amount  : req.body.payback_amount}, function (err,data) {
                if(err){
                    console.log(err);
                }
                else{
                    console.log("saved to database")
                }
            });
        }
    });


});

module.exports = router;

