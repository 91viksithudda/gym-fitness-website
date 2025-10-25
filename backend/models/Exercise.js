const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  targetMuscle: {
    type: String,
    required: true
  },
  equipment: {
    type: String,
    required: true
  },
  gifUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);