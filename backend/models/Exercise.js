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
  category: {
    type: String,
    required: true
  },
  bodyPart: {
    type: String,
    required: true
  },
  emoji: {
    type: String,
    required: true
  },
  gifUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  recommendedDuration: {
    type: Number, // Recommended duration in seconds
    default: 60
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);