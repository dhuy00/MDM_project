const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticate = require("../middleware/authMiddleware");

// Lấy giỏ hàng của user (đã đăng nhập)
router.get("/", authenticate, cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", authenticate, cartController.addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/update", authenticate, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/remove", authenticate, cartController.removeFromCart);

module.exports = router;
