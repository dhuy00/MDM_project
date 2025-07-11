const jwt = require("jsonwebtoken");
const User = require("../models/mysql/user");

// Middleware kiểm tra xác thực người dùng
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, "secret_key");

    // Tìm user
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User không tồn tại",
      });
    }

    // Lưu thông tin user vào request
    req.user = {
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Lỗi xác thực:", error);
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

module.exports = { verifyToken };
