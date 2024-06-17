const express = require('express');
const router = express.Router();
const {addRoute, getRoutes, getRouteDetails, addOrSubtractPoints, markRouteAsSent, unmarkRouteAsSent} = require('../controllers/routeCard');
const { authenticate } = require('../middlewares/auth');

router.post('/add', addRoute);
router.get('/routes/:id', getRouteDetails);
router.get('/routes', getRoutes);
router.post('/send', authenticate, addOrSubtractPoints);
router.post('/mark-as-sent', authenticate, markRouteAsSent);
router.post('/unmark-as-sent', authenticate, unmarkRouteAsSent);


module.exports = router;
