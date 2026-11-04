const mongoose = require('mongoose');
 
const schema = new mongoose.Schema(
  {
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Camp',
      required: true,
    },
    donor: {
      // ✅ FIX: String se ObjectId kar diya — real user ID store hogi
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
 
// Ek donor ek camp mein sirf ek baar register kar sakta hai
// Yeh unique index ensure karta hai ki sirf SAME user dobara block ho
// Dusre users par koi asar nahi padega
schema.index({ camp: 1, donor: 1 }, { unique: true });
 
module.exports = mongoose.model('CampRegistration', schema);
 