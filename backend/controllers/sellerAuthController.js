const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Shop } = require("../models/mysql");
const redisClient = require("../db/redisClient");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Đăng ký seller
const registerSeller = async (req, res) => {
  try {
    const { full_name, email, phone, password, shop_name, description } = req.body;

    // Validate input
    if (!full_name || !email || !password || !shop_name) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email đã được đăng ký",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with seller role
    const newUser = await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
      role: "seller",
      status: "active",
    });

    // Create shop for the seller
    const newShop = await Shop.create({
      user_id: newUser.user_id,
      shop_name,
      description: description || "",
      rating: 0.0,
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký seller thành công",
      user: {
        user_id: newUser.user_id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      shop: {
        shop_id: newShop.shop_id,
        shop_name: newShop.shop_name,
        description: newShop.description,
      },
    });
  } catch (error) {
    console.error("Seller registration error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký",
    });
  }
};

// Đăng nhập seller
const loginSeller = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    // Find user by email or phone
    const user = await User.findOne({
      where: {
        [require("sequelize").Op.or]: [
          { email: username },
          { phone: username },
        ],
        role: "seller", // Only sellers can login through this endpoint
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản đã bị vô hiệu hóa",
      });
    }

    // Find the associated shop
    const shop = await Shop.findOne({
      where: {
        user_id: user.user_id,
      },
    });

    if (!shop) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy cửa hàng",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        role: user.role,
        shop_id: shop.shop_id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Store session in Redis
    await redisClient.setEx(`seller_session:${user.user_id}`, 86400, token);

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shop: {
          shop_id: shop.shop_id,
          shop_name: shop.shop_name,
          description: shop.description,
          rating: shop.rating,
        },
      },
    });
  } catch (error) {
    console.error("Seller login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
    });
  }
};

// Đăng xuất seller
const logoutSeller = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Remove session from Redis
    await redisClient.del(`seller_session:${userId}`);
    
    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Seller logout error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng xuất",
    });
  }
};

// Check seller authentication
const checkSellerAuth = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: Shop,
          as: "Shop",
          required: true,
        },
      ],
    });

    if (!user || user.role !== "seller") {
      return res.status(401).json({
        authenticated: false,
        message: "Không có quyền truy cập",
      });
    }

    res.json({
      authenticated: true,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        shop: {
          shop_id: user.Shop.shop_id,
          shop_name: user.Shop.shop_name,
          description: user.Shop.description,
          rating: user.Shop.rating,
        },
      },
    });
  } catch (error) {
    console.error("Check seller auth error:", error);
    res.status(500).json({
      authenticated: false,
      message: "Lỗi server",
    });
  }
};

module.exports = {
  registerSeller,
  loginSeller,
  logoutSeller,
  checkSellerAuth,
};
