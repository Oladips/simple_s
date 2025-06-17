const express = require('express');
const router = express.Router();
const protect = require('../middlewares/auth');
const {
  createProduct,
  linkProductToStream,
  getProductsForStream
} = require('../controllers/product_controller');

router.post('/', protect, createProduct); // create product
router.post('/link', protect, linkProductToStream); // link product to livestream
router.get('/stream/:streamId', getProductsForStream); // get products for a stream

module.exports = router;
