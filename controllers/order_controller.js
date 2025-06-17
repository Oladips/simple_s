const Order = require('../models/order');
const Product = require('../models/product');
const { success, error } = require('../utils/response');

exports.placeOrder = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json(
      error({
        errors: 'Product not found',
        message: 'Product not found'
      })
    );

    const order = await Order.create({
      productId,
      buyerId: req.user._id,
      amount: product.price,
      status: 'PENDING'
    });

    res.status(201).json(
      success({
        data: order,
        message: 'Order placed successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};
