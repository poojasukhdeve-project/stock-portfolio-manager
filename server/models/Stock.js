const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    companyName: {
      type: String,
      required: true
    },
    sector: {
      type: String,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
