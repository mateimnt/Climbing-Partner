const mongoose = require('mongoose');
const User = require('../models/userSchema');

const getUsername = async (req, res) => {
    try {
      const userId = req.user.id; 
      console.log('User ID from token:', userId); // Debug log
  
      const user = await User.findById(userId).select('username'); 
      console.log('User found:', user); // Debug log

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ username: user.username });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = { getUsername };

