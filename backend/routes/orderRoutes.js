const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

// Đặt hàng mới - yêu cầu đăng nhập
router.post("/place", verifyToken, orderController.placeOrder);

// Lấy danh sách đơn hàng của user đã đăng nhập
router.get("/user", verifyToken, orderController.getOrdersByUser);

// Lấy chi tiết đơn hàng
router.get("/:order_id", verifyToken, orderController.getOrderDetail);

// Hủy đơn hàng
router.put("/:order_id/cancel", verifyToken, orderController.cancelOrder);

// Đặt lại đơn hàng
router.post("/:order_id/reorder", verifyToken, orderController.reorder);

module.exports = router;
