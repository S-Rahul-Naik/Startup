const express = require('express');
const router = express.Router();
const Upi = require('../models/Upi');
const { auth } = require('../middleware/auth');

// Get current UPI ID (public)
router.get('/', async (req, res) => {
  try {
    const upi = await Upi.findOne().sort({ updatedAt: -1 });
    res.json({ upiId: upi ? upi.upiId : '' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch UPI ID' });
  }
});

// Set/update UPI ID (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const { upiId } = req.body;
    if (!upiId) return res.status(400).json({ error: 'UPI ID is required' });
    const upi = new Upi({ upiId, updatedBy: req.user._id });
    await upi.save();
    res.json({ upiId: upi.upiId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set UPI ID' });
  }
});

module.exports = router;
