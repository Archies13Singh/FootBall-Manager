import mongoose from "mongoose";

const TransferMarketSchema = new mongoose.Schema(
  {
    player: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        // Add other player fields you need
        name: String,
        // ... other player properties
        team: {
          type: Object,
          required: true,
        },
        sellPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Add timestamps for when listings are created/updated
  }
);

export default mongoose.models.TransferMarket ||
  mongoose.model("TransferMarket", TransferMarketSchema);
