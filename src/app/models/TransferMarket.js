import mongoose from "mongoose";

const TransferMarketSchema = new mongoose.Schema({
  player: {
    type: Object,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,  // This makes sellPrice mandatory
  },
});


export default mongoose.models.TransferMarket || mongoose.model("TransferMarket", transferMarketSchema);
