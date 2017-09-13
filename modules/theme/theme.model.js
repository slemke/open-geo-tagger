const mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});


var Theme = mongoose.model('Theme', ThemeSchema);
module.exports = Theme;
