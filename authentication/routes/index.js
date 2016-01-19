var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var mongoose = require('mongoose');
var passport= require('passport');
var LocalStrategy= require('passport-local').Strategy;
 var rand,link;
 
mongoose.connect('mongodb://localhost/authenticate');//name of database
 
var db = mongoose.connection;// create connection with mongoose
 
db.on('error', function (err) {
  console.log('connection error', err);
});

db.once('open', function () {
  console.log('connected.');
});

  passport.serializeUser(function(user, done) {
        done(null,user);
    });

    passport.deserializeUser(function(user, done) {
        //User.findById(id, function(err, user) {
            done(null, user);
        //});
    });


var Schema = mongoose.Schema;// declare schema (what are the fields in data base)

var userSchema = new Schema({
  username : {type: String, required: true, unique: true},
  password : String,
  fullname : String,
    status : Number,
      rand : Number
      
});

var User = mongoose.model('User', userSchema); 

router.get('/', function(req, res) {
    res.render('index');
  });


var transporter = nodemailer.createTransport("SMTP",{
    service: 'Gmail',
    auth: {
        user: 'mss.testing2016@gmail.com ',
        pass: 'Admin123#'
    }
});

function sendMail(sentmail,rand,callback){
  console.log("function",link);
  var mailOptions = {
    from: 'malvika@mastersoftwaresolutions.com', // sender address
    to: sentmail, // list of receivers
    subject: 'confirmation mail ', // Subject line
    text: 'Hello world 🐴.thanks for registering with us', // plaintext body
    html: '<center><p> <span style=" border: 11px solid red; font-size: 40px; text-align: center"> Thank you for showing interest in us </span></p><h1><span style="border-radius:3px; text-align: center"><a href="http://localhost:3007/'+ rand +'" target="_blank">click here</a> for verification</span></h1></center>'
};
  transporter.sendMail(mailOptions, function(error, info){
        if(error){
          console.log("error",error);
        }else{
          console.log('Message sent');
        }
  });
    callback(true);
}


router.post('/login' , function(req , res ) {
    var fullname = req.body.fullname;
    var username = req.body.username;
    var password = req.body.password;
    var rand=Math.floor((Math.random() * 100) + 54);
    
    console.log(fullname);

      var user = new User({
          fullname:fullname,
          username:username,
          password:password,
          status:0,
          rand:rand
       });

      user.save( function(error, data){
          if(error){
              res.json(error);
          }
          else{
                  res.json(data);
                  link="localhost:3007/verify/"+rand;

                    sendMail(req.body.username, rand, function(returnvalue){
                        
                        console.log("link send to:  ",link);

                        if(returnvalue==true)
                        {
                          console.log("message sent");
                        }   
                     });
               }
        });
 });

router.get('/:id',function(req,res){
  console.log("id",req.params.id);
   User.findOne({ rand: req.params.id}, function(result,err) {
    if(rand==rand) {
      User.update({ rand: req.params.id },{ $set: { status:1} }, function(err, docs)
            { 
              //res.send({status:1});
               res.render('index');
            });
           }
        
        else 
            { 
            res.send(err); 
             }
    });
});

passport.use('local',new LocalStrategy({
  username:'username',
  password:'password',
     }, function(username, password, done){
  process.nextTick(function(){

  User.findOne({ username:username }, function(err,user){
          if(err)
          {
             return done(err);
          }
          if(!user)
          {
             return done(null,'Incorrect Username');
          }
          if(user.password!= password)
          {
             return done(null, 'Incorrect password');
          }

           return done(null, user);

      })
   });
 }));


router.post('/profile', function(req, res, next) {
  console.log("bye111",req.body.username);
        if (!req.body.username || !req.body.password) {
            res.send({ error: 'Username and Password required' });
            console.log("bye",req.body.username);
            }
        
        passport.authenticate('local', function(err, user) {
          console.log("bye11111",user);

            if (err) { 
                 res.send(err);
                      }
            else{
                  var user1=user;
                  req.logIn(user, function(err) {
                      if (err) {
                        console.log("error",err)
                           res.send(err);
                               }
                      else
                         {
                          console.log("details",req.user);
                          res.send(req.user);
                         }

                     res.send({ redirect: '/profile' });
                  });
            }
        }) (req, res, next);
    });

module.exports = router;
