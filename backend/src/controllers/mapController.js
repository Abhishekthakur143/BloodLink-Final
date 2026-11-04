const User = require('../models/User');
const Camp = require('../models/Camp');

// Get Nearby Donors
exports.getNearbyDonors = async (req, res) => {
  try {
    // Abhi hum sab donors bhej rahe hain. Real app mein lat/lng se $near query chalti hai.
   const donors = await User.find({ role: 'donor' }).select('-password');
    res.status(200).json({ success: true, data: donors });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get Nearby Hospitals
exports.getNearbyHospitals = async (req, res) => {
  try {
    const hospitals = await User.find({ role: 'hospital' }).select('-password');
    res.status(200).json({ success: true, data: hospitals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get Nearby Camps
exports.getNearbyCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: 'upcoming' });
    res.status(200).json({ success: true, data: camps });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};