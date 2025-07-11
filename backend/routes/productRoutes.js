const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Get all products
router.get("/", productController.getAllProducts);

// Search products
router.get("/search", productController.searchProducts);

// Get product categories
router.get("/categories", productController.getCategories);

// Get product brands
router.get("/brands", productController.getBrands);

// Get similar products
router.get("/similar/:id", productController.getSimilarProducts);

// Get a product by ID
router.get("/:id", productController.getProductById);

module.exports = router;
