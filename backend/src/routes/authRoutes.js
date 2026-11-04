
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
 
// ── Auth Middleware ───────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, error: 'Not authorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, error: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token invalid or expired' });
  }
};
 
// ── Email Sender ──────────────────────────────────────────────────
// ── Email Sender (Brevo API) ──────────────────────────────────────
console.log('Mailer: Brevo API v1');
const sendEmail = async ({ to, subject, html }) => {
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'BloodLink', email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
};
// ── Register ──────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    console.log("Register request aayi hai!");
    const user = await User.create(req.body);
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ── Login ─────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ── GET ME ────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ── Update Profile ────────────────────────────────────────────────
router.put('/update', async (req, res) => {
  try {
    const { userId, name, phone, bloodGroup } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, bloodGroup },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
 
// ── FORGOT PASSWORD ───────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
 
  if (!email) {
    return res.status(400).json({ success: false, error: 'Please provide an email address' });
  }
 
  try {
    const user = await User.findOne({ email });
 
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If this email exists, a reset link has been sent.'
      });
    }
 
    // Step 1: Token generate karo
    const resetToken = user.getResetPasswordToken();
 
    // Step 2: PEHLE save karo — email baad mein
    await user.save({ validateBeforeSave: false });
 
    console.log('✅ Token saved to DB:', user.resetPasswordToken);
    console.log('✅ Expire:', user.resetPasswordExpire);
 
    // Step 3: Email bhejo
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('✅ Reset URL:', resetUrl);
 
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
          .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); padding: 32px 28px; text-align: center; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; font-weight: 800; }
          .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px; }
          .body { padding: 32px 28px; }
          .body p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
          .btn { display: block; width: fit-content; margin: 24px auto; padding: 14px 36px; background: linear-gradient(135deg, #dc2626, #ef4444); color: #fff !important; text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 15px; text-align: center; }
          .warning { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #92400e; margin-top: 20px; }
          .footer { background: #f9fafb; padding: 20px 28px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩸 Reset Your Password</h1>
            <p>BloodLink — Blood Donation Network</p>
          </div>
          <div class="body">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Click below to reset your BloodLink password:</p>
            <a href="${resetUrl}" class="btn">🔐 Reset My Password</a>
            <div class="warning">
              ⏰ <strong>This link expires in 15 minutes.</strong>
            </div>
            <p style="margin-top:20px; font-size:13px; color:#6b7280;">
              Or copy this link directly into your browser:<br/>
              <span style="color:#dc2626; word-break:break-all; font-family:monospace;">${resetUrl}</span>
            </p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} BloodLink ❤️</div>
        </div>
      </body>
      </html>
    `;
 
    try {
      await sendEmail({
        to: user.email,
        subject: '🔐 BloodLink — Password Reset Request',
        html,
      });
      console.log('✅ Email sent successfully');
    } catch (emailErr) {
      // ✅ FIX: Email fail hone par token clear NAHI karte
      // Token DB mein rahega — user dobara try kar sakta hai
      console.error('❌ Email send failed:', emailErr.message);
      return res.status(500).json({
        success: false,
        error: 'Email could not be sent. Please check your email address and try again.'
      });
    }
 
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email!'
    });
 
  } catch (err) {
    console.error('❌ Forgot password error:', err.message);
    res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
});
 
// ── RESET PASSWORD ────────────────────────────────────────────────
router.put('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
 
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
 
    console.log('=== RESET DEBUG ===');
    console.log('Token from URL:', req.params.token);
 
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
 
    console.log('Hashed:', hashedToken);
 
    const userCheck = await User.findOne({ resetPasswordToken: hashedToken });
    console.log('User found:', userCheck ? userCheck.email : 'NOT FOUND');
    if (userCheck) {
      console.log('Expired?', userCheck.resetPasswordExpire < Date.now());
    }
 
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
 
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset link. Please request a new one.'
      });
    }
 
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
 
    const token = user.getSignedJwtToken();
    console.log('✅ Password reset successful for:', user.email);
 
    res.status(200).json({
      success: true,
      message: 'Password reset successful!',
      token,
      user,
    });
 
  } catch (err) {
    console.error('Reset error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
 
module.exports = router;