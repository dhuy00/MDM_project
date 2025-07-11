const mongoose = require("mongoose");
const connectMongoDB = require("../../config/mongodb");

// Kết nối MongoDB nếu chưa kết nối
if (mongoose.connection.readyState === 0) {
  connectMongoDB();
}

const ProductSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  category: String,
  brand: String,
  specifications: {
    sleeveLength: String,
    manufacturer: String,
    address: String,
  },
  variants: {
    Size: [String],
    Màu: [String],
  },
  price: Number,
  stock: Number,
  rating: Number,
  views: Number,
  sales: Number,
  isFeatured: Boolean,
  status: String,
  images: [String],
  thumbnail: String,
  videoUrl: String,
  tags: [String],
  shipping: {
    weight: String,
    dimensions: String,
    methods: [
      {
        name: String,
        price: Number,
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
