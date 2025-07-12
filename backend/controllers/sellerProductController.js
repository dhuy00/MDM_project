const Product = require("../models/mongodb/product");
const Shop = require("../models/mysql/shop");
const User = require("../models/mysql/user");
const mongoose = require("mongoose");

// Get all products for seller's shop
const getShopProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const shopId = req.user.shop_id;

    // Build search query
    const searchQuery = {
      shop_id: shopId,
    };

    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Get products with pagination
    const products = await Product.find(searchQuery)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Product.countDocuments(searchQuery);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get shop products error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
    });
  }
};

// Get single product by ID (seller can only access their own products)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shop_id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    const product = await Product.findOne({
      _id: id,
      shop_id: shopId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sản phẩm",
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const shopId = req.user.shop_id;
    const {
      name,
      description,
      price,
      category,
      images,
      thumbnail,
      colors,
      variations,
      stock,
      shipping_fee,
      specifications,
      tags,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc",
      });
    }

    // Create product
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images: images || [],
      thumbnail: thumbnail || "",
      colors: colors || [],
      variations: variations || [],
      stock: parseInt(stock) || 0,
      shipping_fee: parseFloat(shipping_fee) || 0,
      specifications: specifications || {},
      tags: tags || [],
      shop_id: shopId,
      sales: 0,
      rating: 0,
      reviews: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sản phẩm",
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shop_id;
    const updateData = req.body;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.shop_id;
    delete updateData.sales;
    delete updateData.reviews;
    delete updateData.created_at;
    
    // Set updated timestamp
    updateData.updated_at = new Date();

    // Update product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, shop_id: shopId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.user.shop_id;

    // Validate if the ID is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      shop_id: shopId,
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để xóa",
      });
    }

    res.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
    });
  }
};

// Get shop statistics
const getShopStats = async (req, res) => {
  try {
    const shopId = req.user.shop_id;

    // Get product count
    const totalProducts = await Product.countDocuments({ shop_id: shopId });
    
    // Get products in stock
    const inStockProducts = await Product.countDocuments({ 
      shop_id: shopId, 
      stock: { $gt: 0 } 
    });
    
    // Get out of stock products
    const outOfStockProducts = await Product.countDocuments({ 
      shop_id: shopId, 
      stock: { $lte: 0 } 
    });

    // Get total sales
    const salesResult = await Product.aggregate([
      { $match: { shop_id: shopId } },
      { $group: { _id: null, totalSales: { $sum: "$sales" } } }
    ]);
    const totalSales = salesResult[0]?.totalSales || 0;

    // Get average rating
    const ratingResult = await Product.aggregate([
      { $match: { shop_id: shopId, rating: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    const avgRating = ratingResult[0]?.avgRating || 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        inStockProducts,
        outOfStockProducts,
        totalSales,
        avgRating: Math.round(avgRating * 100) / 100,
      },
    });
  } catch (error) {
    console.error("Get shop stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê shop",
    });
  }
};

module.exports = {
  getShopProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getShopStats,
};
