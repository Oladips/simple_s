const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Not authorized. No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return next(new Error('User not found'));

    socket.user = user; // Attach user to socket
    next();
  } catch (err) {
    next(new Error('Not authorized. Invalid token'));
  }
};

module.exports = socketAuth;
