const jwt = require('jsonwebtoken');
const redisClient = require('../db/redisClient');

// Middleware kiểm tra xác thực người dùng
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Không tìm thấy token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    // Kiểm tra token còn trong Redis không
    const sessionToken = await redisClient.get(`session:${decoded.userId}`);
    if (!sessionToken || sessionToken !== token) {
      return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
    }

    // Gắn thông tin user vào req để sử dụng trong route tiếp theo
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Không có quyền truy cập' });
  }
};

module.exports = authenticate;
