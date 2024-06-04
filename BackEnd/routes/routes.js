// routes/routes.js

const express = require('express');
const router = express.Router();

const RouteCard = require('../models/routeCard');

router.post('/', async (req, res) => {
  try {
    const newRouteCard = req.body;
    const savedRouteCard = await RouteCard.create(newRouteCard);
    res.status(201).json(savedRouteCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const routeCards = await RouteCard.find();
      res.status(200).json(routeCards);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
