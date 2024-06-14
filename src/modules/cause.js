const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
    title: { 
        type: String, 
    },
    description: { 
        type: String, 
    },
    categoryId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: { 
        type: String, 
    },
    status: { 
        type: String, 
        default: "Pending",
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
  });

module.exports = mongoose.model('Cause', causeSchema);