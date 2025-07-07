const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });
  }
});

router.post("/", async (req, res) => {
  console.log("📥 Dữ liệu nhận từ client:", JSON.stringify(req.body, null, 2));
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Lỗi lưu sản phẩm:", err);
    res.status(400).json({ error: "Không thể thêm sản phẩm" });
  }
});


module.exports = router;
