const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/user');
const { authenticate } = require('../middlewares/auth'); 

router.get('/details', authenticate, getUserDetails);

module.exports = router;