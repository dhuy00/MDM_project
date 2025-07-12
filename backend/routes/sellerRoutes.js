const express = require("express");
const router = express.Router();
const {
  getShopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getShopStats,
} = require("../controllers/sellerProductController");
const { authenticateSeller } = require("../middleware/sellerAuthMiddleware");

// All routes require seller authentication
router.use(authenticateSeller);

// Product management routes
router.get("/products", getShopProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Statistics
router.get("/stats", getShopStats);

module.exports = router;
