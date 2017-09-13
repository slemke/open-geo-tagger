const mongoose = require('mongoose');

var ObjectSchema = new mongoose.Schema({
  location: {
    type: Array,
    required: true
  },
    categories: {
         type: Array,
    required: true
    },
     description: {
         type: String,
    unique: false,
    required: true,
    trim: false
    },
    userID: {
             type: String,
    unique: false,
    required: true,
    trim: false
    },
    themeID: {
            type: String,
    unique: false,
    required: true,
    trim: false
    }
}, {
  timestamps: true
});

var Object = mongoose.model('Object', ObjectSchema);
module.exports = Object;
