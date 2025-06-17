const mongoose = require('mongoose');

const livestreamSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, required: true },
  streamUrl: { type: String },
  status: {
    type: String,
    enum: ['LIVE', 'OFFLINE'],
    default: 'OFFLINE'
  },
  startedAt: Date,
  endedAt: Date,
  roomName: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Livestream', livestreamSchema);