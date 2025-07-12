const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/authMiddleware");

// Test endpoint to check authentication
router.get("/test-auth", authenticate, (req, res) => {
  console.log("Test auth endpoint - req.user:", req.user);
  res.json({ 
    message: "Authentication working", 
    user: req.user,
    userId: req.user ? req.user.userId : "undefined" 
  });
});

// Lấy giỏ hàng của user (đã đăng nhập)
router.get("/", authenticate, cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", authenticate, cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", authenticate, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", authenticate, cartController.removeFromCart);

module.exports = router;
