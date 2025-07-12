const mongoose = require("mongoose");
const connectMongoDB = require("../../config/mongodb");

// Kết nối MongoDB nếu chưa kết nối
if (mongoose.connection.readyState === 0) {
  connectMongoDB();
}

const CartProductSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true },
    variant: {
      type: Object,
      default: null,
      // Lưu thông tin biến thể sản phẩm (size, màu, ...)
    },
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  products: [CartProductSchema],
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", CartSchema);
