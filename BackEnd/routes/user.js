const express = require('express');
const router = express.Router();
const { getUserDetails, getAllUsers } = require('../controllers/user');
const { authenticate } = require('../middlewares/auth'); 

router.get('/details', authenticate, getUserDetails);
router.get('/all', authenticate, getAllUsers);

module.exports = router;