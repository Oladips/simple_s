const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { getLivekitToken } = require('../controllers/livekit_controller');

router.post('/token', protect, getLivekitToken);

module.exports = router;
