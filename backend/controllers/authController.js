const db = require("../db/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../db/redisClient");

class AuthController {
  // Đăng ký
  register = async (req, res) => {
    try {
      const { phone, password, full_name } = req.body;

      const [userExist] = await db.query(
        "SELECT user_id FROM users WHERE phone = ?",
        [phone]
      );
      if (userExist.length > 0) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.query(
        "INSERT INTO users (phone, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)",
        [phone, hashedPassword, full_name, "customer", "active"]
      );

      res.status(201).json({ success: true, message: "Đăng ký thành công" });
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      res.status(500).json({
        success: false,
        message: "Đăng ký thất bại",
        error: error.message,
      });
    }
  };

  // Đăng nhập
  login = async (req, res) => {
    try {
      const { phone, password } = req.body;
      console.log("Login attempt for phone:", phone);

      const [users] = await db.query(
        'SELECT * FROM users WHERE phone = ? AND status = "active"',
        [phone]
      );
      console.log("Users found:", users.length);
      
      if (users.length === 0) {
        return res
          .status(400)
          .json({ message: "Số điện thoại hoặc mật khẩu không đúng" });
      }

      const user = users[0];
      console.log("User found:", { user_id: user.user_id, phone: user.phone, role: user.role });
      
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
      
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Số điện thoại hoặc mật khẩu không đúng" });
      }

      const token = jwt.sign(
        { userId: user.user_id, phone: user.phone, role: user.role },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "7d" }
      );
      
      console.log("Token created:", token.substring(0, 20) + "...");
      console.log("Token payload:", { userId: user.user_id, phone: user.phone, role: user.role });

      await redisClient.set(`session:${user.user_id}`, token, {
        EX: 7 * 24 * 60 * 60,
      });
      
      console.log("Token saved to Redis for user:", user.user_id);

      res.json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user.user_id,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({
        success: false,
        message: "Đăng nhập thất bại",
        error: error.message,
      });
    }
  };

  // Kiểm tra token còn hợp lệ không
  checkAuth = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ authenticated: false, message: "Không tìm thấy token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
      const savedToken = await redisClient.get(`session:${decoded.userId}`);

      if (!savedToken || savedToken !== token) {
        return res.status(401).json({
          authenticated: false,
          message: "Token không hợp lệ hoặc đã đăng xuất",
        });
      }

      const [users] = await db.query(
        "SELECT user_id, phone, full_name, role FROM users WHERE user_id = ?",
        [decoded.userId]
      );
      if (users.length === 0) {
        return res
          .status(404)
          .json({ authenticated: false, message: "User không tồn tại" });
      }

      res.json({
        authenticated: true,
        user: users[0],
      });
    } catch (error) {
      console.error("Lỗi check auth:", error);
      res.status(401).json({
        authenticated: false,
        message: "Token không hợp lệ hoặc hết hạn",
      });
    }
  };

  // Đăng xuất
  logout = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");

      await redisClient.del(`session:${decoded.userId}`);

      res.json({ message: "Đăng xuất thành công" });
    } catch (error) {
      console.error("Logout error:", error);
      res
        .status(500)
        .json({ message: "Đăng xuất thất bại", error: error.message });
    }
  };
}

module.exports = new AuthController();
