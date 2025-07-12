const jwt = require('jsonwebtoken');
const redisClient = require('../db/redisClient');

// Middleware kiểm tra xác thực người dùng
const authenticate = async (req, res, next) => {
  try {
    console.log("Debug - Auth middleware called");
    const authHeader = req.headers.authorization;
    console.log("Debug - Auth header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("Debug - No valid auth header");
      return res.status(401).json({ message: 'Không tìm thấy token' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Debug - Token:", token.substring(0, 20) + "...");
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    console.log("Debug - Decoded token:", decoded);

    // Kiểm tra token còn trong Redis không
    const sessionToken = await redisClient.get(`session:${decoded.userId}`);
    if (!sessionToken || sessionToken !== token) {
      console.log("Debug - Token not found in Redis or mismatch");
      return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }

    // Gắn thông tin user vào req để sử dụng trong route tiếp theo
    req.user = decoded;
    console.log("Debug - User set in req:", req.user);

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Không có quyền truy cập' });
  }
};

module.exports = authenticate;
