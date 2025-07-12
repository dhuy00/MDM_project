const mongoose = require("mongoose");
const connectMongoDB = require("../../config/mongodb");

// Kết nối MongoDB nếu chưa kết nối
if (mongoose.connection.readyState === 0) {
  connectMongoDB();
}

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: String,
  brand: String,
  shop_id: { type: Number, required: true },
  specifications: {
    sleeveLength: String,
    manufacturer: String,
    address: String,
  },
  variants: {
    Size: [String],
    Màu: [String],
  },
  colors: [String],
  variations: [String],
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, default: "active" },
  images: [String],
  thumbnail: String,
  videoUrl: String,
  tags: [String],
  shipping_fee: { type: Number, default: 0 },
  reviews: [
    {
      user_id: Number,
      rating: Number,
      comment: String,
      created_at: { type: Date, default: Date.now },
    },
  ],
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
