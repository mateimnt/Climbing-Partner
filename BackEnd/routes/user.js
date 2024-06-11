const express = require('express');
const router = express.Router();
const { getUsername } = require('../controllers/user');
const { authenticate } = require('../middlewares/auth'); 

router.get('/username', authenticate, getUsername);

module.exports = router;