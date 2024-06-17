const mongoose = require('mongoose');
const Route = require('../models/routeCard');
const User = require('../models/userSchema');

const pointsMapping = {
  yellow: 100,
  green: 200,
  red: 300,
  blue: 400,
  black: 500,
  white: 1000
};

const addRoute = async (req, res) => {
  try {
      const { sideColor, pictureUrl, typeClass, repeatNr } = req.body;

      // Validate input
      if (!sideColor || !pictureUrl || !Array.isArray(typeClass) || typeof repeatNr !== 'number') {
          return res.status(400).json({ message: 'Invalid input data' });
      }

      // Create a new route
      const newRoute = new Route({
          sideColor,
          pictureUrl,
          typeClass,
          repeatNr
      });

      // Save the route to the database
      await newRoute.save();

      res.status(201).json(newRoute);
  } catch (error) {
      console.error('Error adding new route:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRouteDetails = async (req, res) => {
  try {
      const routeId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(routeId)) {
          return res.status(400).json({ message: 'Invalid Route ID' });
      }

      const route = await Route.findById(routeId);
      if (!route) {
          return res.status(404).json({ message: 'Route not found' });
      }

      res.status(200).send(route);
  } catch (error) {
      console.error('Error fetching route details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const addOrSubtractPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { routeId, action } = req.body;

    if (!routeId) {
      console.error('Route ID is required');
      return res.status(400).json({ message: 'Route ID is required' });
    }

    // Validate and convert routeId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      console.error('Invalid Route ID:', routeId);
      return res.status(400).json({ message: 'Invalid Route ID' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      console.error('Route not found:', routeId);
      return res.status(404).json({ message: 'Route not found' });
    }

    const routePoints = pointsMapping[route.sideColor];
    if (!routePoints) {
      console.error('Invalid route color:', route.sideColor);
      return res.status(400).json({ message: 'Invalid route color' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'add') {
      user.points += routePoints;
    } else if (action === 'subtract') {
      user.points -= routePoints;
    } else {
      console.error('Invalid action:', action);
      return res.status(400).json({ message: 'Invalid action' });
    }

    await user.save();

    res.json({ message: ` Points ${action === 'add' ? 'added' : 'subtracted'} successfully! You now have ${user.points} points.`, points: routePoints});
  } catch (error) {
    console.error(`Error ${action === 'add' ? 'adding' : 'subtracting'} points:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const markRouteAsSent = async (req, res) => {
  const { routeId } = req.body;
  const userId = req.user._id;

  try {
      const route = await Route.findById(routeId);
      if (!route) {
          return res.status(404).json({ message: 'Route not found' });
      }

      if (!route.sentBy.includes(userId)) {
          route.sentBy.push(userId);
          await route.save();
      }

      res.json({ message: 'Route marked as sent' });
  } catch (error) {
      console.error('Error marking route as sent:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const unmarkRouteAsSent = async (req, res) => {
  const { routeId } = req.body;
  const userId = req.user._id;

  try {
      const route = await Route.findById(routeId);
      if (!route) {
          return res.status(404).json({ message: 'Route not found' });
      }

      const index = route.sentBy.indexOf(userId);
      if (index > -1) {
          route.sentBy.splice(index, 1);
          await route.save();
      }

      res.json({ message: 'Route unmarked as sent' });
  } catch (error) {
      console.error('Error unmarking route as sent:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {addRoute, getRoutes, getRouteDetails, addOrSubtractPoints, markRouteAsSent, unmarkRouteAsSent};

