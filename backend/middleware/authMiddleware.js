const jwt = require('jsonwebtoken');
const redisClient = require('../db/redisClient');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const sessionToken = await redisClient.get(`session:${decoded.userId}`);

    if (!sessionToken || sessionToken !== token) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authenticate;
