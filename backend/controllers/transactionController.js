const Transaction = require('../models/transaction');

// Add a new transaction
const addTransaction = async (req, res) => {
    const { amount, category, subcategory, description, date } = req.body;
    const { id: userId } = req.user;  // Use 'id' instead of '_id' here

    console.log('Incoming Request Body:', req.body);
    console.log('User Data (from token):', req.user);

    if (!amount || !category || !subcategory || !date || !userId) {
        return res.status(400).json({ 
            message: 'All required fields (amount, category, subcategory, date, userId) must be provided.' 
        });
    }

    try {
        const formattedDate = new Date(date);
        console.log('Formatted Date:', formattedDate);

        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }

        const newTransaction = await Transaction.create({
            amount,
            category,
            subcategory,
            description,
            date: formattedDate,
            userId,  // Use userId here
        });

        console.log('Transaction Created:', newTransaction);
        res.status(201).json({ message: 'Transaction added successfully!', transaction: newTransaction });
    } catch (error) {
        console.error('Error while adding transaction:', error);
        res.status(500).json({ message: 'Error adding transaction', error: error.message });
    }
};




// Get all transactions for a user
const getTransactions = async (req, res) => {
    console.log("Incoming request:", req.headers); // Log the headers to see if the token is being passed
    const { id: userId } = req.user;  // Extract userId from the token (req.user)

    try {
        console.log("Fetching transactions for user:", userId); // Log the userId
        const transactions = await Transaction.find({ userId }).sort({ date: -1 });
        console.log("Fetched transactions:", transactions);  // Log the result
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error.message);  // Log the error
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};


// Update a transaction
const updateTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const updates = req.body;

    try {
        const updatedTransaction = await Transaction.findById(transactionId);

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Log the decoded user to ensure it's correctly attached to the request
        console.log('User from Token:', req.user);

        // Check if the user is authorized to update this transaction
        if (updatedTransaction.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this transaction' });
        }

        // Proceed with updating the transaction
        const updated = await Transaction.findByIdAndUpdate(transactionId, updates, { new: true });
        res.status(200).json({ message: 'Transaction updated successfully!', transaction: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating transaction', error: error.message });
    }
};

  
  // Delete a transaction
  const deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;
  
    try {
      const deletedTransaction = await Transaction.findById(transactionId);
  
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Check if the user is authorized to delete this transaction
      if (deletedTransaction.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized to delete this transaction' });
      }
  
      // Proceed with deleting the transaction
      await Transaction.findByIdAndDelete(transactionId);
      res.status(200).json({ message: 'Transaction deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting transaction', error: error.message });
    }
  };
  
  // Get transactions by subcategory for a user
const getTransactionsBySubcategory = async (req, res) => {
    const { subcategory } = req.params;  // or use req.query if you prefer query parameters
    const { id: userId } = req.user;  // Extract userId from the token (req.user)

    if (!subcategory) {
        return res.status(400).json({ message: 'Subcategory must be provided.' });
    }

    try {
        console.log("Fetching transactions for user:", userId, "and subcategory:", subcategory);
        const transactions = await Transaction.find({ userId, subcategory }).sort({ date: -1 });
        console.log("Fetched transactions:", transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions by subcategory:", error.message);
        res.status(500).json({ message: 'Error fetching transactions by subcategory', error: error.message });
    }
};


module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionsBySubcategory,
};
