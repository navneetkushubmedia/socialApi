const express = require('express');
const os = require('os');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const multer = require('multer');
const myEnv = require('dotenv').config();
const db = require('./src/modules/db');
const Route = require('./src/router/Route');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1'; // fallback to localhost
}

const port = process.env.PORT || 8080; // Changed to 8080 for testing
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const dir = path.join(__dirname, 'uploads');
app.use(express.static(dir));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ rejectUnauthorized: false }));

app.set('port', port);
app.get('/', (req, res) => {
  console.log("User Hit");
  res.send('<h1>Hello Account</h1>');
});
app.use('/', Route);

const options = {
  key: fs.readFileSync('key.pem', 'utf8'),  // Provide the pass phrase here if needed
  cert: fs.readFileSync('cert.pem')
};



const server = https.createServer(options, app).listen(port, '0.0.0.0', () => {
  const ip = getLocalIPAddress();
  console.log(`Server running at https://${ip}:${port}/`);
});

// const server = app.listen(port, '0.0.0.0', () => {
//   const ip = getLocalIPAddress();
//   console.log(`Server running at http://${ip}:${port}/`);
// });

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
