const Review = require('../models/Review');

// Tạo đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const {
      productId,
      userId,
      orderId,
      rating,
      comment,
      images,
      video,
      deliveryRating,
      sellerServiceRating
    } = req.body;

    const review = new Review({
      productId,
      userId,
      orderId,
      rating,
      comment,
      images,
      video,
      deliveryRating,
      sellerServiceRating
    });

    await review.save();
    res.status(201).json({ message: 'Đánh giá thành công', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi' });
    }
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Lấy danh sách đánh giá theo sản phẩm
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được đánh giá' });
  }
};
