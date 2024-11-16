const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  currentLoad: {
    type: Number,
    default: 0,
    min: 0,
    max: 3, // Maximum load a partner can handle
  },
  areas: {
    type: [String], // Array of strings representing service areas
    default: [],
  },
  shift: {
    start: {
      type: String, // HH:mm format
      required: true,
    },
    end: {
      type: String, // HH:mm format
      required: true,
    },
  },
  metrics: {
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    cancelledOrders: {
      type: Number,
      default: 0,
    },
  },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model("Partner", PartnerSchema);
