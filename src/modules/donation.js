const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: { 
        type: String, 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Login',
        required: true
    },
    causeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cause',
        required: true
    },
  });

module.exports = mongoose.model('Donation', donationSchema);