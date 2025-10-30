const express = require('express');
const router = express.Router();
const WorkoutSession = require('../models/WorkoutSession');
const auth = require('../middleware/auth');

// Get all workout sessions for a user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await WorkoutSession.find({ userId: req.userId })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new workout session
router.post('/', auth, async (req, res) => {
  try {
    const {
      exerciseName,
      category,
      bodyPart,
      sets,
      reps,
      weight,
      weightUnit,
      time
    } = req.body;

    console.log('Received workout data:', req.body);

    const workout = new WorkoutSession({
      userId: req.userId,
      exerciseName,
      category,
      bodyPart,
      sets,
      reps,
      weight,
      weightUnit,
      time
    });

    const savedWorkout = await workout.save();
    console.log('Workout saved successfully:', savedWorkout);
    res.status(201).json(savedWorkout);
  } catch (error) {
    console.error('Error saving workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a workout session
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      exerciseName,
      category,
      bodyPart,
      sets,
      reps,
      weight,
      weightUnit,
      time
    } = req.body;

    const workout = await WorkoutSession.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout session not found' });
    }
    
    // Check if user owns this workout
    if (workout.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update workout fields
    workout.exerciseName = exerciseName || workout.exerciseName;
    workout.category = category || workout.category;
    workout.bodyPart = bodyPart || workout.bodyPart;
    workout.sets = sets !== undefined ? sets : workout.sets;
    workout.reps = reps !== undefined ? reps : workout.reps;
    workout.weight = weight !== undefined ? weight : workout.weight;
    workout.weightUnit = weightUnit || workout.weightUnit;
    workout.time = time !== undefined ? time : workout.time;

    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workout sessions by user ID
router.get('/:userId', async (req, res) => {
  try {
    const workouts = await WorkoutSession.find({ userId: req.params.userId })
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error('Error fetching user workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout session
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await WorkoutSession.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout session not found' });
    }
    
    // Check if user owns this workout
    if (workout.userId.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await WorkoutSession.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout session removed' });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;