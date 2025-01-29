const mongoose = require("mongoose");

const linksSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  linkHash: {
    type: String,
    required: true,
    unique: true,
  },
  clickCount: {
    type: Number,
    default: 1,
  },
  remarks: {
    type: String,
    required: true,
  },
  linkExpiration: {
    type: Date,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Links", linksSchema);
