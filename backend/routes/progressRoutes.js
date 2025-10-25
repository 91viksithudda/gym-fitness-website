const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Complete an exercise
router.post('/complete', auth, async (req, res) => {
  try {
    const { exerciseId, timeSpent } = req.body;

    // Check if already completed today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const existingProgress = await Progress.findOne({
      userId: req.userId,
      exerciseId,
      completedAt: { $gte: startOfDay }
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Exercise already completed today' });
    }

    // Create progress record
    const progress = new Progress({
      userId: req.userId,
      exerciseId,
      timeSpent
    });

    await progress.save();

    // Update user coins (+1 coin for completing an exercise)
    const user = await User.findById(req.userId);
    user.coins += 1;
    
    // Update streak if applicable
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const lastLogin = new Date(user.lastLogin);
    lastLogin.setHours(0, 0, 0, 0);
    
    if (lastLogin.getTime() === yesterday.getTime()) {
      user.streak += 1;
    } else if (lastLogin.getTime() < yesterday.getTime()) {
      user.streak = 1; // Reset streak if missed a day
    }
    
    user.lastLogin = Date.now();
    await user.save();

    res.json({
      message: 'Exercise completed successfully',
      progress,
      coinsEarned: 1,
      totalCoins: user.coins,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user progress
router.get('/:userId', auth, async (req, res) => {
  try {
    // Only allow users to get their own progress
    if (req.userId !== req.params.userId) {
      return res.status(401).json({ message: 'Not authorized to view this progress' });
    }
    
    const progress = await Progress.find({ userId: req.params.userId })
      .populate('exerciseId')
      .sort({ completedAt: -1 });
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;