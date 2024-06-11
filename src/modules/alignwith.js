const mongoose = require('mongoose');

const alignWithSchema = new mongoose.Schema({
    causeId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cause',
        required: true
    },
    businessId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
  });

module.exports = mongoose.model('Alignwith', alignWithSchema);