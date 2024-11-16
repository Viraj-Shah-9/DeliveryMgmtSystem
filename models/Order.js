const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // Assuming each order has a unique order number
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    area: {
      type: String,
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'assigned', 'picked', 'delivered'],
      default: 'pending',
    },
    scheduledFor: {
      type: String, // Storing time as HH:mm format
      required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner', // assuming you have a Partner model
        required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A pre-save hook to update the `updatedAt` field
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Order model
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
