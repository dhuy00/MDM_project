const jwt = require("jsonwebtoken");
const { User, Shop } = require("../models/mysql");
const redisClient = require("../db/redisClient");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to authenticate seller
const authenticateSeller = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có token xác thực",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user has seller role
    if (decoded.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập seller",
      });
    }

    // Check if session exists in Redis
    const sessionToken = await redisClient.get(`seller_session:${decoded.userId}`);
    if (!sessionToken || sessionToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ",
      });
    }

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.userId);

    if (!user || user.status !== "active" || user.role !== "seller") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không hợp lệ",
      });
    }

    // Verify shop exists
    const shop = await Shop.findOne({
      where: { user_id: decoded.userId },
    });

    if (!user || user.status !== "active" || user.role !== "seller") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không hợp lệ",
      });
    }

    if (!shop) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy cửa hàng",
      });
    }

    // Add user info to request
    req.user = {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      shop_id: shop.shop_id,
    };

    next();
  } catch (error) {
    console.error("Seller authentication error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token đã hết hạn",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xác thực",
    });
  }
};

// Middleware to check if user owns the shop
const checkShopOwnership = async (req, res, next) => {
  try {
    const { shop_id } = req.params;
    const userShopId = req.user.shop_id;

    if (shop_id && parseInt(shop_id) !== userShopId) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập shop này",
      });
    }

    next();
  } catch (error) {
    console.error("Check shop ownership error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra quyền truy cập",
    });
  }
};

module.exports = {
  authenticateSeller,
  checkShopOwnership,
};
