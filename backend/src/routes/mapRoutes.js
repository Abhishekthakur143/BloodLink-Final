const express = require('express');
const router = express.Router();
const { getNearbyDonors, getNearbyHospitals, getNearbyCamps } = require('../controllers/mapController');

router.get('/donors', getNearbyDonors);
router.get('/hospitals', getNearbyHospitals);
router.get('/camps', getNearbyCamps);

module.exports = router;