const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. Missing or malformed token." });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Log the token to ensure it's being passed correctly
        console.log('Token received:', token);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Verified Token:', verified); // Log the decoded token
        req.user = verified; // Attach the verified user to the request object
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "Token has expired. Please log in again." });
        }
        res.status(403).json({ message: "Invalid token. Access forbidden." });
    }
};

module.exports = authenticateToken;
