const Livestream = require('../models/livestream');
const { success, error } = require('../utils/response');
const mongoose = require('mongoose');

// Start livestream
exports.startLivestream = async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json(
        error({
          errors: 'Only sellers can go live',
          message: 'Only sellers can go live'
        })
      );
    }

    const { title, streamUrl } = req.body;
    const streamId = new mongoose.Types.ObjectId(); // generate upfront
    const roomName = `stream_${streamId}`;

    const stream = await Livestream.create({
      _id: streamId,
      sellerId: req.user._id,
      title,
      streamUrl,
      status: 'LIVE',
      startedAt: new Date(),
      roomName,
    });

    res.status(201).json(
      success({
        data: stream,
        message: 'Livestream started successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};

// End livestream
exports.endLivestream = async (req, res) => {
  try {
    const stream = await Livestream.findOne({
      sellerId: req.user._id,
      status: 'LIVE'
    });

    if (!stream) return res.status(404).json(
      error({
        errors: 'No active livestream found',
        message: 'No active livestream found'
      })
    );

    stream.status = 'OFFLINE';
    stream.endedAt = new Date();
    await stream.save();

    res.status(200).json(
      success({
        data: stream,
        message: 'Livestream ended successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};

// List active livestreams
exports.getLiveStreams = async (req, res) => {
  try {
    const streams = await Livestream.find({ status: 'LIVE' }).populate('sellerId', 'name email');
      res.status(200).json(
      success({
        data: streams,
        message: 'Livestreams fetched successfully'
      })
    );
  } catch (err) {
    res.status(500).json(error({ errors: err.message, message: 'An error occurred' }));
  }
};
