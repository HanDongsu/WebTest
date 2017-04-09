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
