// Updated authController
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // Input validation
const Transaction = require('../models/transaction');

// Register a new user with validation middleware
const registerUser = [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Log validation errors
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, email, password } = req.body;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists." });
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, passwordHash: hashedPassword });
        await user.save();
  
        res.status(201).json({ message: "User registered successfully." });
      } catch (error) {
        console.error('Error registering user:', error); // Log any unexpected errors
        res.status(500).json({ error: error.message });
      }
    },
  ];
  



// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Extract the userId from the decoded token
      const userId = decoded.id;
  
      // Fetch the user from the database
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) return res.status(404).json({ message: "User not found." });
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Update user budget
const updateUserBudget = async (req, res) => {
    const { userId } = req.params;
    const { total } = req.body; 

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        // Update only the total budget field
        if (total !== undefined) {
            console.log(`Updating total budget to: ${total}`);
            user.budget.total = total;
        }

        // Mark the budget as modified to ensure changes are saved
        user.markModified('budget');

        // Log the updated budget to verify
        console.log("Updated user budget:", user.budget);

        // Save the document
        const updatedUser = await user.save();
        res.status(200).json({ message: "Budget updated successfully.", budget: updatedUser.budget });
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ error: error.message });
    }
};



// Delete user account and related transactions
const deleteUserAccount = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        await Transaction.deleteMany({ userId });
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "User account and related transactions deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reset user data (budget and transactions)
const resetUserData = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        // Reset budget
        user.budget.total = 0;
        user.budget.remaining = 0;

        // Clear transactions related to the user
        user.transactions = [];
        await Transaction.deleteMany({ userId: user._id });

        // Save the updated user data
        await user.save();

        res.status(200).json({ message: "User data (budget and transactions) has been reset successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset user data.' });
    }
};


// Edit user email
const editUserEmail = async (req, res) => {
    const { userId } = req.params;
    const { newEmail } = req.body;

    try {
        console.log('Request to update email for user:', userId);
        console.log('New email to update:', newEmail);

        // Validate the new email
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array()); 
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User with ID ${userId} not found`); 
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the new email already exists
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            console.log(`Email ${newEmail} is already in use`);  
            return res.status(400).json({ message: "Email already in use." });
        }

        // Update the email
        user.email = newEmail;
        await user.save();
        console.log('Email updated successfully for user:', userId); 

        res.status(200).json({ message: "Email updated successfully." });
    } catch (error) {
        // Log the full error details for debugging
        console.error('Error updating email:', error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
    }
};

// Validate email field
const validateEmail = [
    body('newEmail').isEmail().withMessage('Valid email is required'),
];


// Export the function along with the others
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserBudget,
    deleteUserAccount,
    resetUserData,
    editUserEmail,
    validateEmail,
};
