const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livestreamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestream',
    default: null
  },
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  stock: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
