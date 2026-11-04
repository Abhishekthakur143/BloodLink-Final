const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  urgency: { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
  hospitalName: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, enum: ['pending', 'fulfilled', 'cancelled'], default: 'pending' },
  contactNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', schema);