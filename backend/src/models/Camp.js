const mongoose = require('mongoose');
 
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: String, required: true },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  totalSlots: { type: Number, required: true },
  bookedSlots: { type: Number, default: 0 },
  status: {
    type: String,
    // ✅ FIX: 'ended' add kiya — pehle sirf upcoming/ongoing/completed tha
    enum: ['upcoming', 'ongoing', 'completed', 'ended'],
    default: 'upcoming'
  }
}, { timestamps: true });
 
module.exports = mongoose.model('Camp', schema);