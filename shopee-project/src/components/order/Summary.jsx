import React from 'react';

const Summary = () => {
  return (
    <div className="w-full mx-auto bg-white shadow p-4 rounded-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">Yêu thích</span>
          <span className="font-medium">Mobile & Auto Accessories</span>
        </div>
        <div className="flex gap-2 text-sm text-gray-600">
          <button className="border px-2 py-1 rounded hover:bg-gray-100">Chat</button>
          <button className="border px-2 py-1 rounded hover:bg-gray-100">Xem Shop</button>
        </div>
      </div>

      {/* Product */}
      <div className="flex gap-4 border-b pb-4">
        <img
          src="https://down-vn.img.susercontent.com/file/sg-11134201-22110-9y0vib0u9ljv9b"
          alt="product"
          className="w-20 h-20 object-cover"
        />
        <div className="flex-1">
          <p className="font-medium text-gray-800">Cáp Sạc Nhanh Dây Dù Dài 1.2m Cổng Micro USB 5A Cho Android</p>
          <p className="text-sm text-gray-500">Phân loại hàng: #3-Micro USB</p>
          <p className="text-sm text-gray-500">x1</p>
        </div>
        <div className="text-right">
          <p className="line-through text-gray-400 text-sm">₫58.087</p>
          <p className="text-[#ee4d2d] font-semibold">₫23.737</p>
        </div>
      </div>

      {/* Price Summary */}
      <div className="mt-4 text-sm text-gray-700 border-b pb-4 space-y-2">
        <div className="flex justify-between">
          <span>Tổng tiền hàng</span>
          <span>₫23.737</span>
        </div>
        <div className="flex justify-between">
          <span>Phí vận chuyển</span>
          <span>₫17.000</span>
        </div>
        <div className="flex justify-between">
          <span>
            Giảm giá phí vận chuyển
            <span className="ml-1 cursor-pointer text-gray-400" title="Được áp dụng mã miễn phí vận chuyển">ℹ️</span>
          </span>
          <span className="text-[#26aa99]">-₫15.000</span>
        </div>
        <div className="flex justify-between">
          <span>Voucher từ Shop</span>
          <span className="text-[#26aa99]">-₫1.000</span>
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="mt-4 flex justify-between items-center text-base font-medium text-gray-800">
        <span>Thành tiền</span>
        <span className="text-[#ee4d2d] text-xl">₫24.737</span>
      </div>

      {/* Thanh toán khi nhận */}
      <div className="mt-4 bg-yellow-50 text-yellow-700 p-2 text-sm rounded border border-yellow-300">
         Vui lòng thanh toán <strong>₫24.737</strong> khi nhận hàng.
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Phương thức Thanh toán: <span className="font-medium">Thanh toán khi nhận hàng</span>
      </div>
    </div>
  );
};

export default Summary;
