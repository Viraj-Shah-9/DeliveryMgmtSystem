const mongoose = require('mongoose');

// Define the schema for AssignmentMetrics
const AssignmentMetricsSchema = new mongoose.Schema({
  totalAssigned: {
    type: Number,
    required: true,
  },
  successRate: {
    type: Number,
    required: true,
  },
  averageTime: {
    type: Number,
  },
  failureReasons: [
    {
      reason: {
        type: String,
        trim: true
      },
      count: {
        type: Number,
        required: true,
      }
    }
  ]
});

// Create the model from the schema
const AssignmentMetrics = mongoose.model('AssignmentMetrics', AssignmentMetricsSchema);

module.exports = AssignmentMetrics;
