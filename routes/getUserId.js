var express = require('express');
var router = express.Router();
var helper = require('sendgrid').mail;
var from_email = new helper.Email('info@rapidly.co');
var subject = "Password Recovery";


var mongo = require('mongoskin');
ObjectId = require('mongodb').ObjectID;

db = mongo.db('mongodb://rapidly:root@ds133922.mlab.com:33922/rapidly_tax');

/* GET registration page. */
router.post('/', function(req, res, next) {
    console.log("inside getUserId.js");
    var collection = db.collection("registration_info");
    collection.findOne({email_id : req.body.email_id}, function (err, data) {
        if (err){
            console.log(err);
        }
        else if (data == null){
            res.json({"data" : "empty"})
        }
        else
        {
            console.log("data found");
            //sending the email
            var to_email = new helper.Email(req.body.email_id);
            var content = new helper.Content('text/plain', 'Customer email address : ' + data._id);
            var mail = new helper.Mail(from_email, subject, to_email, content);
            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });

            sg.API(request, function(error, response) {
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            });

        }

    });





});

module.exports = router;

