const { AccessToken } = require('livekit-server-sdk');
const { success, error } = require('../utils/response');
const Livestream = require('../models/livestream');

const dotenv = require('dotenv');

dotenv.config();

exports.getLivekitToken = async (req, res) => {
  const { roomName } = req.body;

  const stream = await Livestream.findOne({ roomName });
  if (!stream || stream.status !== 'LIVE') {
    return res.status(404).json(
      error({
        errors: 'Live stream not active',
        message: 'Live stream not active'
      })
    );
  }

  if (!roomName) {
    return res.status(400).json(
      error({
        errors: { roomName: 'Room name is required' },
        message: 'roomName is required'
      })
    );
  }

  const user = req.user;

  const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
    identity: user._id.toString(),
    name: user.name
  });

  const grant = {
    roomJoin: true,
    room: roomName,
    canPublish: user.role === 'seller',
    canSubscribe: true,
    canPublishData: true,
  };
  at.addGrant(grant);

  const token = await at.toJwt();
  console.log('JWT Token:', token);
  return res.status(200).json(
    success({
      data: { token, url: process.env.LIVEKIT_URL },
      message: 'LiveKit token generated'
    })
  );
};
