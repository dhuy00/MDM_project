const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");

// Lấy giỏ hàng của user (đã đăng nhập)
router.get("/", verifyToken, cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", verifyToken, cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", verifyToken, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", verifyToken, cartController.removeFromCart);

module.exports = router;
