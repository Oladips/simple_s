const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const { placeOrder } = require('../controllers/order_controller');

router.post('/', protect, placeOrder);

module.exports = router;
