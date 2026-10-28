const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    direction: {
      type: String,
      enum: ["Long", "Short"],
      required: true,
    },
    entryPrice: {
      type: Number,
      required: true,
    },
    exitPrice: {
      type: Number,
      required: true,
    },
    positionSize: {
      type: Number,
      required: true,
    },
    pnl: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    emotion: {
      type: String,
      enum: ["Confident", "Fearful", "Greedy", "Neutral", "Frustrated", "Excited"],
      default: "Neutral",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trade", tradeSchema);