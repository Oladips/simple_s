const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  streamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livestream',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String,
  message: String,
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
