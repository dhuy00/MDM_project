import React from 'react'
import { FaTruck } from 'react-icons/fa'
import { RiCoupon3Fill } from 'react-icons/ri'
import ProductRow from './ProductRow'

const CartItem = ({ shopName, products }) => {
  return (
    <div className='bg-white rounded-[4px] flex flex-col text-[#222] mb-4 shadow-sm'>
      {/* Shop Header */}
      <div className='px-8 flex gap-2 items-center py-4'>
        <input type='checkbox' className='w-4 h-4' />
        <span className='font-medium'>{shopName}</span>
      </div>

      <div className='h-[1px] bg-[#f5f5f5]'></div>

      {/* Products */}
      {products.map((product, index) => (
        <React.Fragment key={index}>
          <ProductRow product={product} />
          <div className='h-[1px] bg-[#f5f5f5]'></div>
        </React.Fragment>
      ))}

      {/* Vouchers */}
      <div className='px-8 py-2 flex items-center gap-2 text-[#05a]'>
        <RiCoupon3Fill className='text-lg text-[#ee4d2d]' />
        <span className='text-[#222]'>Voucher giảm đến 8%</span>
        <a href='#' className='text-[#05a] hover:underline'>Xem thêm voucher</a>
      </div>

      {/* Shipping Promo */}
      <div className='px-8 py-2 flex items-center gap-2 text-[#05a]'>
        <FaTruck className='text-base text-[#00bfa5]' />
        <span className='text-[#222]'>
          Giảm ₫700.000 phí vận chuyển đơn tối thiểu ₫0; Giảm ₫1.000.000 phí vận chuyển đơn tối thiểu ₫500.000
        </span>
        <a href='#' className='hover:underline'>Tìm hiểu thêm</a>
      </div>
    </div>
  )
}

export default CartItem
