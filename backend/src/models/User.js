const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
 
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum:['donor', 'recipient', 'hospital', 'admin', 'donar'] ,default: 'donor' },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  // ✅ NEW: Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });
 
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
 
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
 
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
 
// ✅ NEW: Reset token generate karo
UserSchema.methods.getResetPasswordToken = function() {
  // Random 32-byte token banao
  const resetToken = crypto.randomBytes(32).toString('hex');
 
  // Token ko hash karke DB mein store karo
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
 
  // 15 minutes mein expire hoga
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
 
  // Plain token return karo (email mein jayega)
  return resetToken;
};
 
module.exports = mongoose.model('User', UserSchema);