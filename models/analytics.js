const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Links",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  deviceInfo: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
