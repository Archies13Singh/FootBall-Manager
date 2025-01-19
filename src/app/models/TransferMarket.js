import mongoose from "mongoose";

const TransferMarketSchema = new mongoose.Schema({
  player: [{
    _id: mongoose.Schema.Types.ObjectId,
    name: { 
      type: String, 
      required: true 
    },
    position: { 
      type: String, 
      required: true 
    },
    value: { 
      type: Number, 
      required: true 
    },
    stats: {
      attack: { 
        type: Number, 
        required: true 
      },
      defense: { 
        type: Number, 
        required: true 
      },
      speed: { 
        type: Number, 
        required: true 
      }
    },
    sellPrice: { 
      type: Number, 
      required: true 
    },
    originalTeam: {
      id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
      },
      name: { 
        type: String, 
        required: true 
      },
      owner: { 
        type: String, 
        required: true 
      }
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
TransferMarketSchema.index({ seller: 1 });
TransferMarketSchema.index({ "player._id": 1 });

const TransferMarket = mongoose.models.TransferMarket || mongoose.model('TransferMarket', TransferMarketSchema);

export default TransferMarket;