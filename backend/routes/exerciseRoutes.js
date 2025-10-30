const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');

// Get all exercises with optional filtering
router.get('/', async (req, res) => {
  try {
    const { bodyPart, category } = req.query;
    let filter = {};
    
    if (bodyPart && bodyPart !== 'All') {
      filter.bodyPart = bodyPart;
    }
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    const exercises = await Exercise.find(filter);
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

module.exports = router;