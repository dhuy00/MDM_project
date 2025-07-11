const User = require("../models/mysql/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class authControllers {
  // Đăng nhập
  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      // Kiểm tra user có tồn tại không
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }

      // Kiểm tra mật khẩu
      const validPassword = await bcrypt.compare(password, user.password);
      // const validPassword = password === user.password;

      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        {
          id: user.user_id,
          username: user.username,
          role: user.role,
        },
        "secret_key",
        { expiresIn: "24h" }
      );

      // Trả về thông tin user và token
      res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập",
      });
    }
  };

  // Đăng ký tài khoản
  register = async (req, res) => {
    try {
      const { username, password, email, phone } = req.body;

      // Kiểm tra user đã tồn tại chưa
      const existingUser = await User.findOne({
        where: {
          username,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Tên đăng nhập đã tồn tại",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Tạo user mới
      const newUser = await User.create({
        username,
        password: hashedPassword, // Password đã được hash
        email,
        phone,
        role: "customer",
        rank_id: 1, // Default rank_id to solve potential foreign key issues
      });

      res.status(201).json({
        success: true,
        message: "Đăng ký tài khoản thành công",
        user: {
          id: newUser.user_id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Return more detailed error message to help diagnose the issue
      res.status(500).json({
        success: false,
        message: `Có lỗi xảy ra khi đăng ký: ${error.message}`,
        error:
          process.env.NODE_ENV === "production" ? undefined : error.toString(),
      });
    }
  };

  // Kiểm tra trạng thái đăng nhập
  checkAuth = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          authenticated: false,
          message: "Không tìm thấy token",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, "secret_key");

      // Tìm user
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          authenticated: false,
          message: "User không tồn tại",
        });
      }

      res.status(200).json({
        success: true,
        authenticated: true,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      res.status(401).json({
        success: false,
        authenticated: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  };
}

module.exports = new authControllers();
