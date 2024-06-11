const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    title: { 
        type: String, 
    },
    description: { 
        type: String, 
    },
    businessId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
  });

module.exports = mongoose.model('Promotion', promotionSchema);