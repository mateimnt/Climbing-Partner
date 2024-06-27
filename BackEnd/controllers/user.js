const mongoose = require('mongoose');
const User = require('../models/userSchema');

const getUserDetails = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users from the database
    res.json(users); // Send users as JSON response
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserDetails, getAllUsers };


