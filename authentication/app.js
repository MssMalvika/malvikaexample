var express = require('express');
var path = require('path');
var engine = require('ejs-locals');
var passport= require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var debug = require('debug')('myapp')
var routes = require('./routes/index');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('html',engine);
app.set('view engine', 'html');   

app.use(cookieParser()); 
app.use(bodyParser());
app.use(session({ secret: 'malvika aggarwal' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static(path.join(__dirname, '/public'))); //Expose /public


app.use('/', routes);

module.exports = app;

