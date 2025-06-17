const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {
  startLivestream,
  endLivestream,
  getLiveStreams
} = require('../controllers/livestream_controller');

router.post('/start', protect, startLivestream);
router.post('/end', protect, endLivestream);
router.get('/', getLiveStreams);

module.exports = router;
