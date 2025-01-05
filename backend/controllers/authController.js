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
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer token'
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      // Verify and decode the token
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
    const { total } = req.body;  // Remove monthlyLimit and yearlyLimit

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

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserBudget,
    deleteUserAccount,
};