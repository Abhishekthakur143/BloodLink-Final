const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');
const CampRegistration = require('../models/CampRegistration');
const jwt = require('jsonwebtoken');
 
// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};
 
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};
 
// ─── HELPER: Auto-mark past camps as ended ────────────────────────
const autoMarkEnded = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await Camp.updateMany(
    { date: { $lt: today }, status: { $in: ['upcoming', 'ongoing'] } },
    { $set: { status: 'ended' } }
  );
};
 
// ─── CREATE CAMP (Protected — login required) ──────────────────────
// FIX: protect middleware add kiya — ab sirf logged-in users camp bana sakte hain
router.post('/create', protect, async (req, res) => {
  try {
    const camp = await Camp.create(req.body);
    res.status(201).json({ success: true, data: camp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── GET ALL UPCOMING CAMPS (Public) ──────────────────────────────
// FIX: Upcoming + Today ke camps dikhenge, sirf ended nahi dikhenge
router.get('/all', async (req, res) => {
  try {
    await autoMarkEnded();
    // Aaj ka din bhi include karo
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const camps = await Camp.find({
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: today }
    }).sort({ date: 1 });
    res.status(200).json({ success: true, data: camps });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── GET ALL CAMPS including ended (Admin only) ───────────────────
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    await autoMarkEnded();
    const camps = await Camp.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: camps });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── REGISTER FOR CAMP ─────────────────────────────────────────────
router.post('/:id/register', protect, async (req, res) => {
  try {
    const campId = req.params.id;
    const donorId = req.user.id;
 
    const camp = await Camp.findById(campId);
    if (!camp) {
      return res.status(404).json({ success: false, error: 'Camp not found' });
    }
    if (camp.status === 'ended' || camp.status === 'completed') {
      return res.status(400).json({ success: false, error: 'This camp has already ended' });
    }
    if (camp.bookedSlots >= camp.totalSlots) {
      return res.status(400).json({ success: false, error: 'No slots available. Camp is full!' });
    }
    const alreadyRegistered = await CampRegistration.findOne({ camp: campId, donor: donorId });
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, error: 'You are already registered for this camp' });
    }
 
    await CampRegistration.create({ camp: campId, donor: donorId });
    camp.bookedSlots += 1;
    await camp.save();
 
    res.status(200).json({ success: true, message: 'Successfully registered for the camp!' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── MANUALLY MARK ENDED CAMPS (Admin) ────────────────────────────
router.post('/mark-ended', protect, adminOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await Camp.updateMany(
      { date: { $lt: today }, status: { $in: ['upcoming', 'ongoing'] } },
      { $set: { status: 'ended' } }
    );
    res.status(200).json({ success: true, message: `${result.modifiedCount} camp(s) marked as ended` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── DELETE ONE ENDED CAMP (Admin only) ───────────────────────────
router.delete('/admin/delete-ended/:id', protect, adminOnly, async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ success: false, error: 'Camp not found' });
    if (camp.status !== 'ended') {
      return res.status(400).json({ success: false, error: `Cannot delete a camp with status "${camp.status}". Only ended camps can be deleted.` });
    }
    await CampRegistration.deleteMany({ camp: req.params.id });
    await Camp.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Camp deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ─── DELETE ALL ENDED CAMPS (Admin only) ──────────────────────────
router.delete('/admin/delete-all-ended', protect, adminOnly, async (req, res) => {
  try {
    const endedCamps = await Camp.find({ status: 'ended' });
    if (endedCamps.length === 0) {
      return res.status(200).json({ success: true, message: 'No ended camps to delete' });
    }
    const endedIds = endedCamps.map(c => c._id);
    await CampRegistration.deleteMany({ camp: { $in: endedIds } });
    await Camp.deleteMany({ status: 'ended' });
    res.status(200).json({ success: true, message: `${endedCamps.length} ended camp(s) deleted successfully` });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
module.exports = router;
 