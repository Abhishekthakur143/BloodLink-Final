const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Camp = require('../models/Camp');
const BloodInventory = require('../models/BloodInventory');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'pending' });
    const totalCamps = await Camp.countDocuments();
    const totalStock = await BloodInventory.countDocuments();

    res.status(200).json({ 
      success: true, 
      data: { totalUsers, totalRequests, pendingRequests, totalCamps, totalStock }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// NEW: Get Blood Group Request Stats for Chart
exports.getBloodGroupStats = async (req, res, next) => {
  try {
    const stats = await BloodRequest.aggregate([
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};