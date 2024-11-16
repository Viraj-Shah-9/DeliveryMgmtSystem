const mongoose = require('mongoose');

// Define the schema for the Assignment model
const assignmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // This assumes you have an 'Order' model
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner', // This assumes you have a 'Partner' model
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically sets the timestamp to the current date/time if not provided
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'assigned'],
    required: true
  },
  reason: {
    type: String,
    required: false // Optional field
  }
});

// Create the Assignment model using the schema
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
