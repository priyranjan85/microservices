// middleware/checkPermission.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {

      next();

     
        console.log("Checking issue");
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing 1' });
      }
        
          const decoded = jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET || 'your_secret_key');
  
          const userId = decoded.userId;
    
      const user = await User.findById(userId);

      if (!user || !user.permissions.includes(permission)) {
        return res.status(403).json({ error: 'Unauthorized: Insufficient permissions' });
      }

      next();
   
    } catch (error) {

      res.status(400).json({ error: 'Unauthorized: Insufficient permissions' });
    }
  };
};

module.exports = checkPermission;
