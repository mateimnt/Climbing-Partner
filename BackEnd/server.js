// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('dotenv').config(); // Load environment variables from .env file

const routeCardRoutes = require('./routes/routes'); // Adjusted the path to the routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/routes', routeCardRoutes);

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

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
