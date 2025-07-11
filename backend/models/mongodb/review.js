const mongoose = require("mongoose");
const connectMongoDB = require("../../config/mongodb");

// Kết nối MongoDB nếu chưa kết nối
if (mongoose.connection.readyState === 0) {
  connectMongoDB();
}

const ReviewSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  order_id: { type: Number, required: false }, // Made optional since orders are in MySQL
  rating: { type: Number, required: true },
  comment: String,
  images: [String],
  videos: [String],
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);
