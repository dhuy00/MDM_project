import React from 'react'
import { FaTicketAlt } from 'react-icons/fa'

const CartSummary = () => {
  return (
    <div className="bg-white border-t border-gray-200 flex flex-col mx-32">
      {/* Voucher Row */}
      <div className="flex justify-between items-center px-6 py-3  text-[#222]">
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-[#ee4d2d]" />
          <span>Shopee Voucher</span>
        </div>
        <button className="text-[#05a] hover:underline">Chọn hoặc nhập mã</button>
      </div>

      <div className="border-t border-dashed border-gray-200"></div>

      {/* Action Row */}
      <div className="flex justify-between items-center px-6 py-4 flex-wrap gap-2">
        {/* Left actions */}
        <div className="flex items-center gap-4 flex-wrap">
          <input type="checkbox" className="w-4 h-4" />
          <span>Chọn Tất Cả (6)</span>
          <button className="hover:underline">Xóa</button>
          <button className="hover:underline">Bỏ sản phẩm không hoạt động</button>
          <button className="text-[#ee4d2d] hover:underline">Lưu vào mục Đã thích</button>
        </div>

        {/* Right total and action */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-right">
            <span className="text-gray-700">
              Tổng cộng (0 Sản phẩm):
            </span>
            <span className="text-[#ee4d2d] text-lg font-semibold ml-1">₫0</span>
          </div>
          <button className="bg-[#ee4d2d] text-white px-6 py-2 rounded hover:opacity-90">
            Mua Hàng
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartSummary
