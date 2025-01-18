import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: String,
  owner: String,
  budget: {
    type: Number,
    default: 5000000
  },
  players: [{
    name: { type: String },
    position: { type: String},
    value: { type: Number },
    stats: {
      attack: { type: Number, required: true },
      defense: { type: Number, required: true },
      speed: { type: Number, required: true }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Team || mongoose.model('Team', teamSchema);
