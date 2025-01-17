const express = require('express');
const router = express.Router();
const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionsBySubcategory, 
} = require('../controllers/transactionController');
const authenticateToken = require('../middleware/authMiddleware');

// Add a new transaction
router.post('/', authenticateToken, addTransaction);

// Get all transactions for a user
router.get('/', authenticateToken, getTransactions);

// Get transactions by subcategory for a user
router.get('/subcategory/:subcategory', authenticateToken, getTransactionsBySubcategory); // New route

// Update a transaction
router.put('/:transactionId', authenticateToken, updateTransaction);

// Delete a transaction
router.delete('/:transactionId', authenticateToken, deleteTransaction);

module.exports = router;
