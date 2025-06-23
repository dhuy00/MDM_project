import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { FaCamera } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";

const ReviewModal = ({ onClose }) => {
  const [productRating, setProductRating] = useState(5);
  const [sellerServiceRating, setSellerServiceRating] = useState(5);
  const [highlight, setHighlight] = useState('');
  const [quality, setQuality] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const reviewData = {
      productRating,
      sellerServiceRating,
      highlight,
      quality,
      comment,
    };
    console.log('Submitted Review:', reviewData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 text-xl font-semibold border-b">Đánh Giá Sản Phẩm</div>

        <div className="px-6 py-4">
          {/* Hướng dẫn nhận xu */}
          <div className="bg-yellow-100 border border-yellow-300 rounded flex items-center p-3 text-sm mb-4">
            <span>Xem Hướng dẫn đánh giá chuẩn để nhận đến </span>
            <span className="ml-1 text-orange-700 font-bold">200 xu!</span>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="flex gap-3 items-start mb-3">
            <img src="/your-product-image.jpg" alt="product" className="w-16 h-16 object-cover border" />
            <div className="text-sm">
              <div className="font-semibold">Giá đỡ laptop, Đế tản nhiệt laptop gấp gọn điều chỉnh độ cao...</div>
              <div className="text-gray-500">Phân loại hàng: N3 - 15in Full Đen</div>
            </div>
          </div>

          {/* Đánh giá chất lượng sản phẩm */}
          <div className="mb-4">
            <div className="font-semibold text-sm mb-1">Chất lượng sản phẩm</div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <AiFillStar
                  key={i}
                  className={`w-6 h-6 cursor-pointer ${i <= productRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  onClick={() => setProductRating(i)}
                />
              ))}
              <span className="ml-2 text-orange-500 font-medium">Tuyệt vời</span>
            </div>
          </div>

          {/* Input */}
          <div className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 font-semibold">Tính năng nổi bật:</label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Để lại đánh giá"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Chất lượng sản phẩm:</label>
              <input
                type="text"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="Ví dụ: tốt, chắc chắn, đáng mua..."
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé."
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Thêm hình ảnh / video */}
          <div className="mt-4 space-y-2 text-sm text-main-orange">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 border border-main-orange rounded hover:bg-orange-50">
                <FaCamera />
                <span>Thêm Hình ảnh</span>

              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-main-orange rounded hover:bg-orange-50">
                <FaVideo />
                <span>Thêm Video</span>
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Thêm 50 ký tự và 1 hình ảnh và 1 video để nhận <span className="text-red-500 font-medium">200 xu</span>
            </p>
          </div>

          {/* Hiển thị tên */}
          <div className="flex items-start gap-2 mt-4">
            <input type="checkbox" defaultChecked className="mt-1" />
            <div>
              <p className="font-medium text-sm">Hiển thị tên đăng nhập trên đánh giá này</p>
              <p className="text-xs text-gray-500">Tên tài khoản sẽ được hiển thị như z_ub20snju</p>
            </div>
          </div>

          {/* Đánh giá dịch vụ */}
          <div className="pt-6">
            <div className="text-sm font-semibold mb-2">Về Dịch vụ</div>

            {/* Dịch vụ người bán */}
            <div className="flex items-center mb-2">
              <span className="w-48 text-sm">Dịch vụ của người bán</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <AiFillStar
                    key={i}
                    className={`w-5 h-5 cursor-pointer ${i <= sellerServiceRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    onClick={() => setSellerServiceRating(i)}
                  />
                ))}
                <span className="ml-2 text-orange-500 text-sm">Tuyệt vời</span>
              </div>
            </div>

            {/* Dịch vụ vận chuyển (bị mờ) */}
            <div className="flex items-center mb-2">
              <span className="w-48 text-sm">Dịch vụ vận chuyển</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <AiFillStar
                    key={i}
                    className={`w-5 h-5 cursor-pointer ${i <= sellerServiceRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    onClick={() => setSellerServiceRating(i)}
                  />
                ))}
                <span className="ml-2 text-orange-500 text-sm">Tuyệt vời</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t gap-3 text-sm">
          <button
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            TRỞ LẠI
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={handleSubmit}
          >
            HOÀN THÀNH
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
