var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , cookie = require('cookie-parser')
  , expressSession = require('express-session')
  , expressError = require('express-error-handler')
  , passport = require('passport')
  , flash = require('connect-flash')
  , socketio = require('socket.io')
  , cors = require('cors');

var app = express();
app.get('/signIn', function(request, response) {
	response.sendFile(__dirname + '/client/signIn.html');
});
app.get('/signUp', function(request, response) {
	response.sendFile(__dirname + '/client/signUp.html')
});
app.get("/", function(req, res) {
	res.send('hello World!');
});
app.listen(8000, function() {
	console.log("connect 8000 port!")
});