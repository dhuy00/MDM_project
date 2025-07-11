const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Tạo đánh giá
router.post('/', reviewController.createReview);

// Lấy đánh giá theo sản phẩm
router.get('/:productId', reviewController.getReviewsByProduct);

module.exports = router;
