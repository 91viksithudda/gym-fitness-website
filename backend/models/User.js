const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  subscription: {
    status: {
      type: String,
      enum: ['inactive', 'active', 'expired'],
      default: 'inactive'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    plan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic'
    }
  },
  usedCoupons: [{
    code: String,
    discount: Number,
    usedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);