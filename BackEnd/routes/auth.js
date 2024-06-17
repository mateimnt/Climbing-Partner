const express = require('express');
const { register, login, verifyToken} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-token', verifyToken);

module.exports = router;
        