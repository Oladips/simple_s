const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/response');

// Register new user
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json(
        error({
            errors: 'User already exists',
            message: 'User already exists'
        })
    );
  
      const newUser = new User({ name, email, password, role });
      await newUser.save();
  
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json(
        success({
            data: { user: newUser, token },
            message: 'User registered successfully'
        })
    );
    } catch (err) {
      console.log(err);
      res.status(500).json(
        error({
            errors: err.message,
            message: 'An error occurred'
        })
    );
    }
  };

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json(
        error({
            errors: 'User not found',
            message: 'User not found'
        })
    );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json(
        error({
            errors: 'Invalid credentials',
            message: 'Invalid credentials'
        })
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json(
        success({
            data: { user, token },
            message: 'User logged in successfully'
        })
    );
  } catch (err) {
    res.status(500).json(
        error({
            errors: err.message,
            message: 'An error occurred'
        })
    );
  }
};
