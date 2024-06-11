const express = require('express');
const router = express.Router();
const {addRoute, getRoutes, getRouteDetails, addOrSubtractPoints} = require('../controllers/routeCard');
const { authenticate } = require('../middlewares/auth');

router.post('/add', addRoute);
router.get('/routes/:id', getRouteDetails);
router.get('/routes', getRoutes);
router.post('/send', authenticate, addOrSubtractPoints);


module.exports = router;
