const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get leaderboard (top 10 users by coins)
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name coins streak')
      .sort({ coins: -1 })
      .limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;