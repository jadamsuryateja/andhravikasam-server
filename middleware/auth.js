import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token without checking expiration
    jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, decoded) => {
      if (err && err.name !== 'TokenExpiredError') {
        return res.status(403).json({ message: 'Invalid token' });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
