const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const multer = require('multer');
const db = require('./madara/modules/modelDb');
const Paths = require('./madara/path/Paths');
const fs = require('fs');
const https = require('https');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const dir = path.join(__dirname, 'files');
app.use(express.static(dir));
app.use('/files', express.static('files'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ rejectUnauthorized: false }));

app.set('port', port);
app.get('/', (req, res) => {
  res.send('<h1>User Testing</h1>');
});
app.use('/', Paths);

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at ${port}/`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
