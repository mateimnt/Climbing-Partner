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
    },
    sentBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
  }
);

const RouteCard = mongoose.model('routeCards', routeCardSchema);

module.exports = RouteCard;
