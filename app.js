var express = require('express');
const bodyParser = require('body-parser');
var device = require('express-device');
const fs = require('fs');
//var http = require('http');
var http = require('https');
var cors = require('cors');   // For cross origin device access
var path = require('path');
var mongoose = require('mongoose');
var request = require('request');
var multer  =   require('multer'); 

const myEnv = require('dotenv').config();

var db = require('./src/modules/db');  // DB config module

const Route = require('./src/router/Route');

// const localIPAddress = '192.168.29.39';
var port = process.env.PORT || 80;   // Port used for user server
var app = express()
  , server = require('http').createServer(app);;

server.listen(port);

app.use(bodyParser.urlencoded({ extended: true }));

var dir = path.join(__dirname, 'uploads');
app.use(express.static(dir));

app.use('/uploads', express.static('uploads'));


app.use(cors());
app.use(device.capture());

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ rejectUnauthorized: false }));

app.set('port', port);


app.get('/', function (req, res) { console.log("User Hit"); res.send('<h1>Hello Account</h1>'); });

app.use('/', Route);


