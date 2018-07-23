const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shelter = new Schema({
  city: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  zipCode: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Shelter', shelter);