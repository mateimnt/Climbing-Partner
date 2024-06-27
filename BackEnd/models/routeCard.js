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
    sentBy: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

const RouteCard = mongoose.model('routeCards', routeCardSchema);

module.exports = RouteCard;
