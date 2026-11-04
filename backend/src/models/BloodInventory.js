const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  organization: { type: String, required: true }, // Hospital ka naam
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  status: { type: String, enum: ['available', 'expired', 'issued'], default: 'available' },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BloodInventory', schema);