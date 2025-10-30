const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  expirationDate: {
    type: Date,
    required: true
  },
  maxUses: {
    type: Number,
    default: null // null means unlimited uses
  },
  usedCount: {
    type: Number,
    default: 0
  },
  // Track which users have used this coupon
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);