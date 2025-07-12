const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticate = require("../middleware/authMiddleware");

// Đặt hàng mới - yêu cầu đăng nhập
router.post("/place", authenticate, orderController.placeOrder);

// Lấy danh sách đơn hàng của user đã đăng nhập
router.get("/user", authenticate, orderController.getOrdersByUser);

// Lấy chi tiết đơn hàng
router.get("/:order_id", authenticate, orderController.getOrderDetail);

// Hủy đơn hàng
router.put("/:order_id/cancel", authenticate, orderController.cancelOrder);

// Đặt lại đơn hàng
router.post("/:order_id/reorder", authenticate, orderController.reorder);

module.exports = router;
