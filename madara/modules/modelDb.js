require('dotenv').config();
var mongoose  =   require('mongoose');

mongoose.connect('mongodb+srv://faizansohail2000:acswil123@cluster0.bumba1x.mongodb.net/socialApi');
var db = mongoose.connection;

// CONNECTION EVENTS
db.on('connected', function() {
  console.log('DB connected');
});
db.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
db.on('disconnected', function() {
  console.log('Mongoose disconnected');
});
// BRING IN YOUR SCHEMAS & MODELS
