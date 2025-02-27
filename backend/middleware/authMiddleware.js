// /src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT tokens.
 *
 * Expected header: "Authorization: Bearer <token>"
 */
exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    // Attach decoded payload (e.g., { id, email, iat, exp }) to req.user
    req.user = decoded;
    next();
  });
};

exports.adminCheck = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // Allow access if admin
  }
  return res.status(403).json({ message: 'Admin access required.' });
};
