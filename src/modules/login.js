const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const login = new Schema({
    name : {
        type : String
    },
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    role : {
        type : String, 
    },
    token : {
        type: String
    },
}, {timestamps :true});

module.exports = mongoose.model('Login',login );
