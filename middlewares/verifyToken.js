const jwt = require('jsonwebtoken');

// Middleware to verify the token from the Authorization header
exports.verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization');

  // If no token is provided, return a 401 Unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the token using the secret key stored in the environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the verified user to the request object
    req.user = verified.user;
    
    // Move to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return a 400 Bad Request error
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};
