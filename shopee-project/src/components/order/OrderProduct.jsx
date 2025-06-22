// components/order/OrderProduct.jsx
import React from 'react'
import { FaTruck } from 'react-icons/fa6'
import { FaAngleDown } from "react-icons/fa6";

const OrderProduct = ({ product }) => {
  return (
    <div className="bg-white p-4 mb-4 shadow-sm rounded">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <div className="flex gap-2">
          <span className="bg-[#ee4d2d] text-white text-xs px-1 rounded">Yêu thích</span>
          <span className="font-semibold">{product.shop}</span>
          <button className="text-xs border px-2 py-0.5 ml-2">Xem Shop</button>
        </div>
        <div className="text-sm flex items-center gap-2 text-green-600">
          <FaTruck className="text-base" />
          <span>{product.shippingStatus}</span>
          <span className="text-[#ee4d2d] font-medium">{product.status}</span>
        </div>
      </div>

      {/* Product */}
      <div className="flex gap-4 mb-2">
        <img
          src={product.image}
          alt="product"
          className="w-20 h-20 object-cover rounded border"
        />
        <div className="flex flex-col justify-center">
          <div className="font-medium">{product.name}</div>
          <div className="text-xs text-gray-500">Phân loại hàng: {product.variant}</div>
          <div className="text-xs text-gray-500">x{product.quantity}</div>
        </div>
        <div className="ml-auto flex flex-col justify-center text-right text-sm">
          <span className="line-through text-gray-400">{product.oldPrice}</span>
          <span className="text-[#ee4d2d] font-semibold">{product.price}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-3 flex justify-between items-center">
        <div></div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-sm">
            Thành tiền: <span className="text-[#ee4d2d] text-lg font-semibold">{product.total}</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-[#ee4d2d] text-white px-8 py-1 rounded">Đánh Giá</button>
            <button className="border px-4 py-1 rounded hover:bg-gray-100">Yêu Cầu Trả Hàng/Hoàn Tiền</button>
            <button className="border px-4 py-1 rounded hover:bg-gray-100 flex items-center gap-1">
              <span>Thêm</span>
              <FaAngleDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderProduct
