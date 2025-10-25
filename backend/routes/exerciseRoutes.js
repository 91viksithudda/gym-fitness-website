const express = require('express');
const Exercise = require('../models/Exercise');

const router = express.Router();

// Get all exercises
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exercise by ID
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// For demo purposes, we'll seed some exercises
const seedExercises = [
  {
    name: 'Push-ups',
    targetMuscle: 'Chest, Shoulders, Triceps',
    equipment: 'Bodyweight',
    gifUrl: 'https://example.com/pushups.gif',
    description: 'A basic upper body exercise'
  },
  {
    name: 'Squats',
    targetMuscle: 'Quadriceps, Glutes, Hamstrings',
    equipment: 'Bodyweight',
    gifUrl: 'https://example.com/squats.gif',
    description: 'A compound lower body exercise'
  },
  {
    name: 'Plank',
    targetMuscle: 'Core, Shoulders',
    equipment: 'Bodyweight',
    gifUrl: 'https://example.com/plank.gif',
    description: 'An isometric core strength exercise'
  },
  {
    name: 'Bicep Curls',
    targetMuscle: 'Biceps',
    equipment: 'Dumbbells',
    gifUrl: 'https://example.com/bicepcurls.gif',
    description: 'An isolation exercise for the biceps'
  },
  {
    name: 'Running',
    targetMuscle: 'Legs, Core, Cardiovascular System',
    equipment: 'Treadmill or outdoors',
    gifUrl: 'https://example.com/running.gif',
    description: 'A great cardio exercise'
  }
];

// Seed exercises endpoint (for demo purposes)
router.post('/seed', async (req, res) => {
  try {
    // Check if exercises already exist
    const existingExercises = await Exercise.countDocuments();
    if (existingExercises > 0) {
      return res.status(400).json({ message: 'Exercises already seeded' });
    }

    // Insert seed exercises
    await Exercise.insertMany(seedExercises);
    res.json({ message: 'Exercises seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;