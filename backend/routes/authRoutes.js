const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserBudget,
    deleteUserAccount
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

// Route for registering a new user
router.post('/register', registerUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route for fetching user profile (protected route)
router.get('/profile', authenticateToken, getUserProfile);

// Route for updating user budget (protected route)
router.put('/budget/:userId', authenticateToken, updateUserBudget);

// Route for deleting user account and related transactions (protected route)
router.delete('/delete-account/:userId', authenticateToken, deleteUserAccount);

module.exports = router;
