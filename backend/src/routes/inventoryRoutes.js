const express = require('express');
const router = express.Router();
const BloodInventory = require('../models/BloodInventory');

// Add Blood Stock
router.post('/add', async (req, res) => {
  try {
    const inventory = await BloodInventory.create(req.body);
    res.status(201).json({ success: true, data: inventory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get Available Inventory
router.get('/available', async (req, res) => {
  try {
    const inventory = await BloodInventory.find({ status: 'available' }).sort({ bloodGroup: 1 });
    res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;