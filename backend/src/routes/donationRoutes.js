const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const BloodRequest = require('../models/BloodRequest');
const jwt = require('jsonwebtoken');
 
// AUTH MIDDLEWARE
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
 
// CHECK ELIGIBILITY
router.get('/eligibility', protect, async (req, res) => {
  try {
    const donorId = req.user.id;
    const lastDonation = await Donation.findOne({ donor: donorId }).sort({ createdAt: -1 });
    if (!lastDonation) {
      return res.status(200).json({ success: true, eligible: true, message: 'You are eligible to donate blood!' });
    }
    const daysSince = Math.floor((new Date() - new Date(lastDonation.createdAt)) / (1000 * 60 * 60 * 24));
    const eligible = daysSince >= 90;
    res.status(200).json({
      success: true,
      eligible,
      daysSince,
      nextEligibleDate: eligible ? null : new Date(new Date(lastDonation.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000),
      message: eligible ? 'You are eligible to donate blood!' : `You can donate again in ${90 - daysSince} days`
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// GET MY DONATIONS
router.get('/my-donations', protect, async (req, res) => {
  try {
    const donorId = req.user.id;
    const donations = await Donation.find({ donor: donorId }).populate('request').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// GET DONATION HISTORY
router.get('/history', protect, async (req, res) => {
  try {
    const donorId = req.user.id;
    const donations = await Donation.find({ donor: donorId }).populate('request').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: donations });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// DONATE BLOOD
router.post('/donate/:requestId', protect, async (req, res) => {
  try {
    const { requestId } = req.params;
    const donorId = req.user.id;
 
    const bloodRequest = await BloodRequest.findById(requestId);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, error: 'Blood Request not found' });
    }
    if (bloodRequest.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'This request is already fulfilled or cancelled' });
    }
 
    const lastDonation = await Donation.findOne({ donor: donorId }).sort({ createdAt: -1 });
    if (lastDonation) {
      const daysSince = Math.floor((new Date() - new Date(lastDonation.createdAt)) / (1000 * 60 * 60 * 24));
      if (daysSince < 90) {
        return res.status(400).json({ success: false, error: `You can donate again in ${90 - daysSince} days` });
      }
    }
 
    const donation = await Donation.create({ donor: donorId, request: requestId, status: 'completed' });
    bloodRequest.status = 'fulfilled';
    await bloodRequest.save();
 
    res.status(201).json({ success: true, message: 'Donation successful!', data: donation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// GET CERTIFICATE DATA
router.get('/certificate', protect, async (req, res) => {
  try {
    const donorId = req.user.id;
    const donations = await Donation.find({ donor: donorId, status: 'completed' }).populate('request').sort({ createdAt: -1 });
    if (donations.length === 0) {
      return res.status(400).json({ success: false, error: 'No completed donations found. Make at least one donation to get a certificate.' });
    }
    const User = require('../models/User');
    const user = await User.findById(donorId).select('name email bloodGroup phone');
    res.status(200).json({
      success: true,
      data: {
        donorName: user?.name || 'Donor',
        email: user?.email || '',
        bloodGroup: user?.bloodGroup || 'N/A',
        phone: user?.phone || '',
        totalDonations: donations.length,
        donations: donations.map(d => ({
          id: d._id,
          date: d.createdAt,
          patientName: d.request?.patientName || 'N/A',
          hospital: d.request?.hospitalName || 'N/A',
          bloodGroup: d.request?.bloodGroup || 'N/A',
          status: d.status,
        })),
        issuedOn: new Date(),
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
module.exports = router;
 