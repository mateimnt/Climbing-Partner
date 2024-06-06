const Route = require('../models/routeCard');

// Fetch all routes
const getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getRoutes };
