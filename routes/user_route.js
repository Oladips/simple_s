const express = require('express');
const protect = require('../middlewares/auth');
const router = express.Router();
const { getUser } = require('../controllers/user_controller');
// GET /api/user/me
router.get('/me', protect, getUser);

module.exports = router;