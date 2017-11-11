
var express = require('express');
var router = express.Router();
var multer = require('multer');
var nodemailer = require('nodemailer');
var fs =require('fs');
var async = require('async');
var request = require('request');
var request1 = require('request');

var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
var helper = require('sendgrid').mail;
var from_email = new helper.Email('info@rapidly.co');
var to_email = new helper.Email('info@rapidly.co');
var subject = "Paystub";

var name="";
const CLIENT_ID = '923687857413-nv4h7c2a1h48jp4i8p7ce9qjb3a2impg.apps.googleusercontent.com';
const CLIENT_SECRET = 'L_H4OhqQQia0WgRuR5pSguZp';
const REFRESH_TOKEN = '1/7Lhe7n5D_1KbOF0FK_RAhaAvLfEzyUc67PZnH0MWwiY';
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const PARENT_FOLDER_ID = '0B_YrIIMx49x5SDlhTnZTd0NrVlE';

var storage = multer.diskStorage({ //multers disk storage settings

    destination: function (req, file, cb) {
        cb(null, '../public/image_upload/');
    },
    filename: function (req, file, cb) {
       // var datetimestamp=new String();
      //  datetimestamp = Date.now()+(new Date()).getUTCMilliseconds().toString();
       // var Random=new String();
        Random=Math.floor((Math.random() * 100000) + 1).toString();
        console.log(Random);
        name = Random;
        //name = sess.username.toString().replace(" ","")+"_"+file.fieldname+"_"+file.originalname.split('.')[0] + '-' + datetimestamp.toString()+"_"+Random.toString() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, name + '.pdf' );

    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');



/* upload image to databse. */
router.post('/', function(req, res, next) {
    console.log("inside uploadPaystub.js");

    upload(req,res,function(err){
        console.log("uploading...wait..........");
        if(err){
            console.log(err);
            res.json({error_code:1,err_desc:err+" Name:"+name});
            return;
        }
        else{
            /*---------------------------------------------------------------------------------------------------------------*/
            //Uploading the pdf to google drive


            async.waterfall([
                //-----------------------------
                // Obtain a new access token
                //-----------------------------
                function(callback) {
                    var tokenProvider = new GoogleTokenProvider({
                        'refresh_token': REFRESH_TOKEN,
                        'client_id': CLIENT_ID,
                        'client_secret': CLIENT_SECRET
                    });
                    tokenProvider.getToken(callback);
                },

                function(accessToken, callback) {

                    var fstatus = fs.statSync('../public/image_upload/'+name+'.pdf');
                    fs.open('../public/image_upload/'+name+'.pdf', 'r', function(status, fileDescripter) {
                        if (status) {
                            callback(status.message);
                            return;
                        }

                        var buffer = new Buffer(fstatus.size);
                        fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(err, num) {

                            request1.post({
                                'url': 'https://www.googleapis.com/upload/drive/v2/files',
                                'qs': {
                                    //request module adds "boundary" and "Content-Length" automatically.
                                    'uploadType': 'multipart'

                                },
                                'headers' : {
                                    'Authorization': 'Bearer ' + accessToken
                                },
                                'multipart':  [
                                    {
                                        'Content-Type': 'application/json; charset=UTF-8',
                                        'body': JSON.stringify({
                                            'title': name + '.pdf',
                                            'parents': [
                                                {
                                                    'id': PARENT_FOLDER_ID
                                                }
                                            ]
                                        })
                                    },
                                    {
                                        'Content-Type': 'application/pdf',
                                        'body': buffer
                                    }
                                ]
                            }, callback);

                        });
                    });
                },

                //----------------------------
                // Parse the response
                //----------------------------
                function(response, body, callback) {
                    var body = JSON.parse(body);
                    callback(null, body);
                },

            ], function(err, results) {
                if (!err) {
                    console.log(results);
                    var filePath = '../public/image_upload/'+ name + '.pdf';
                    fs.unlinkSync(filePath);

                } else {
                    console.error('---error');
                    console.error(err);
                }
            });




            //sending the email
            var content = new helper.Content('text/plain', ''+ req.body.username + 'has uploaded the paystub');

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




            /*-------------------------------------------------------------------------------------------------------------------*/
            console.log("Upload successfull");
            console.log(name);
            res.json({data : "Upload successfull"});
        }

    })



});

module.exports = router;

