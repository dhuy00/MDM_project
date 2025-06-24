const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },

  rating: { type: Number, min: 1, max: 5, required: true },   // Số sao cho sản phẩm
  comment: { type: String },
  images: [{ type: String }],
  video: { type: String },

  deliveryRating: { type: Number, min: 1, max: 5 },
  sellerServiceRating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
