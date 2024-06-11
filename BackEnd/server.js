const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/routeCard');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('dotenv').config(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/api', cardRoutes);

const uri = process.env.MONGODB_URI; // Use environment variable for MongoDB URI

mongoose.connect(uri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
