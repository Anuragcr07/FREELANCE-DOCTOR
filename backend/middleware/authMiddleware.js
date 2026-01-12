import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token after "Bearer"

      // Verify token using the same JWT_SECRET used in your login route
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add the user ID to the request object so controllers can use it
      req.user = decoded; 
      
      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};