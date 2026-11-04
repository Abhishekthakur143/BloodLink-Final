const express = require('express');
const router = express.Router();
const { bloodMatchRecommendation, aiChatbot } = require('../controllers/aiController');

router.get('/blood-match', bloodMatchRecommendation);
router.post('/chatbot', aiChatbot);

module.exports = router;