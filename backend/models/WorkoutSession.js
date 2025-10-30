const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
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
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  weightUnit: {
    type: String,
    default: 'kg',
    enum: ['kg', 'lb']
  },
  time: {
    type: Number, // in seconds
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);