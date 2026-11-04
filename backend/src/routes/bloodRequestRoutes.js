const express = require('express');
const router = express.Router();
const BloodRequest = require('../models/BloodRequest');
const jwt = require('jsonwebtoken');
 
// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};
 
// ─── CREATE BLOOD REQUEST ──────────────────────────────────────────
router.post('/create', protect, async (req, res) => {
  try {
    req.body.requester = req.user.id;
    const newRequest = await BloodRequest.create(req.body);
 
    // 🔔 NOTIFICATION 1: Naya blood request — sab donors ko alert
    const io = req.app.get('io');
    if (io) {
      io.emit('new-blood-request', {
        _id: newRequest._id,
        patientName: newRequest.patientName,
        bloodGroup: newRequest.bloodGroup,
        hospitalName: newRequest.hospitalName,
        city: newRequest.city,
        urgency: newRequest.urgency || 'normal',
        message: `🩸 ${newRequest.patientName} needs ${newRequest.bloodGroup} blood at ${newRequest.hospitalName}`,
        timestamp: new Date().toISOString(),
      });
    }
 
    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── GET ALL PENDING REQUESTS ──────────────────────────────────────
router.get('/all', async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: 'pending' })
      .populate('requester', 'name phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── FULFILL / DONATE — request complete karo ─────────────────────
router.patch('/:id/fulfill', protect, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requester', 'name email phone');
 
    if (!request) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }
    if (request.status === 'fulfilled') {
      return res.status(400).json({ success: false, error: 'Already fulfilled' });
    }
 
    request.status = 'fulfilled';
    request.fulfilledBy = req.user.id;
    request.fulfilledAt = new Date();
    await request.save();
 
    // 🔔 NOTIFICATION 2: Donation complete — requester ko personally notify karo
    const io = req.app.get('io');
    if (io) {
      // Specific requester ke room mein bhejo
      io.to(`user_${request.requester._id}`).emit('request-fulfilled', {
        requestId: request._id,
        donorName: req.user.name,
        bloodGroup: request.bloodGroup,
        message: `✅ Great news! Your blood request for ${request.bloodGroup} has been fulfilled by a donor.`,
        timestamp: new Date().toISOString(),
      });
 
      // Sab ko bhi broadcast karo (optional — dashboard update ke liye)
      io.emit('request-status-update', {
        requestId: request._id,
        status: 'fulfilled',
        bloodGroup: request.bloodGroup,
        hospitalName: request.hospitalName,
      });
    }
 
    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── CANCEL REQUEST ────────────────────────────────────────────────
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
    if (request.requester.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this request' });
    }
 
    request.status = 'cancelled';
    await request.save();
 
    // 🔔 NOTIFICATION 3: Request cancel hua
    const io = req.app.get('io');
    if (io) {
      io.emit('request-status-update', {
        requestId: request._id,
        status: 'cancelled',
        bloodGroup: request.bloodGroup,
      });
    }
 
    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
module.exports = router;