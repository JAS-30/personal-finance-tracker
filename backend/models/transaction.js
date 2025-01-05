const mongoose = require('mongoose');

// Transaction schema to reflect the database structure
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0, 'Transaction amount must be positive'], // Validation for positive amounts
  },
  category: {
    type: String,
    required: true, 
    enum: ['income', 'expense'], // Restrict to specific categories
  },
  subcategory: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters'], // Optional length restriction
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User',
    required: true,
  },
});

// Create and export the Transaction model
module.exports = mongoose.model('Transaction', transactionSchema);
