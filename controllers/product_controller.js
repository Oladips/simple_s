const Product = require('../models/product');
const Livestream = require('../models/livestream');
const { success, error } = require('../utils/response');

// Create a product
exports.createProduct = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json(
        error({
          errors: 'Only sellers can create products',
          message: 'Only sellers can create products'
        })
      );
    }

    const product = await Product.create({ ...req.body, sellerId: req.user._id });
    res.status(201).json(
      success({
        data: product,
        message: 'Product created successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};

// Link product to livestream
exports.linkProductToStream = async (req, res) => {
  try {
    const { productId } = req.body;

    const stream = await Livestream.findOne({
      sellerId: req.user._id,
      status: 'LIVE'
    });

    if (!stream) {
      return res.status(404).json(
        error({
          errors: 'No active stream found',
          message: 'No active stream found'
        })
      );
    }

    const product = await Product.findOne({ _id: productId, sellerId: req.user._id });
    if (!product) return res.status(404).json(
      error({
        errors: 'Product not found',
        message: 'Product not found'
      })
    );

    product.livestreamId = stream._id;
    await product.save();

    res.status(200).json(
      success({
        data: product,
        message: 'Product linked to livestream'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};

// Get products for a stream
exports.getProductsForStream = async (req, res) => {
  try {
    const { streamId } = req.params;
    const products = await Product.find({ livestreamId: streamId });
      res.status(200).json(
      success({
        data: products,
        message: 'Products fetched successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};
