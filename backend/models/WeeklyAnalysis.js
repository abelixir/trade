const mongoose = require("mongoose");

const weeklyAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    weekStart: {
      type: Date,
      required: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    expectations: {
      type: String,
      default: "",
    },
    images: [
      {
        url: String,       // compressed base64
        name: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WeeklyAnalysis", weeklyAnalysisSchema);