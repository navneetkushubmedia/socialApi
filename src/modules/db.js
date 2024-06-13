require('dotenv').config();
var mongoose  =   require('mongoose');

mongoose.connect('mongodb+srv://billing:Singhnavi4487@cluster0.qo4rl.mongodb.net/social');
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
