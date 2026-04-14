  const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        // Ensure this matches how you saved it in loginUser (usually user.id or user._id)
        req.user = decoded.id; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};