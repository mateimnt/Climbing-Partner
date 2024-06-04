const mongoose = require('mongoose');

const routeCardSchema = new mongoose.Schema(
  {
    sideColor: { 
      type: String, 
      required: true 
    },
    pictureUrl: { 
      type: String, 
      required: true 
    },
    typeClass: { 
      type: [String], 
      required: true 
    },
    repeatNr: { 
      type: Number, 
      required: true 
    }
  }
);

const RouteCard = mongoose.model('routeCard', routeCardSchema);

module.exports = RouteCard;
