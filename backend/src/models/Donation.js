const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodRequest', required: true },
  status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', schema);