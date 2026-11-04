const express = require('express');
const router = express.Router();

// Trigger SOS Alert (UPGRADED)
router.post('/trigger', async (req, res) => {
  try {
    const { userName, bloodGroup, message, lat, lng } = req.body;
    
    // Generate Google Maps Link from Lat/Lng
    let mapLink = 'Location not available';
    if (lat && lng) {
      mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('emergency-sos', { 
        userName, 
        bloodGroup, 
        message: message || `🚨 EMERGENCY: ${userName} urgently needs ${bloodGroup} blood!`, 
        mapLink // Maps link broadcast hoga
      });
    }

    res.status(200).json({ success: true, message: "SOS Alert Broadcasted!" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;