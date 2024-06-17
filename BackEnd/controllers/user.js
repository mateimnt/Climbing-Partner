const mongoose = require('mongoose');
const User = require('../models/userSchema');

const getUserDetails = async (req, res) => {
  try {
    const user = req.user; // Assuming the user is already authenticated and the user object is attached to req
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserDetails };


