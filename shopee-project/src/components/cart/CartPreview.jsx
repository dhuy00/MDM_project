import React from 'react'
import perfume from '../../assets/perfume.jpg'

const ProductItem = () => {
  return (
    <div className='flex gap-2 items-center justify-between hover:bg-gray-100 cursor-pointer p-2'>
      <div className='flex gap-2'>
        <img src={perfume} alt='product-img' className='w-12 h-12 object-cover
        border' />
        <span className='max-w-[220px] truncate'>
          Sữa tắm trắng da hương nước hoa Gervenne
        </span>
      </div>
      <span className='text-[15px] text-main-orange'>&#x20AB;113.000</span>
    </div>
  )
}

const CartPreview = () => {
  return (
    <div className='absolute right-[60%] bg-white w-[400px] px-4 py-2 flex flex-col gap-2 rounded-sm border'>
      <h3 className='text-gray-500 text-[15px]'>
        Sản phẩm mới thêm
      </h3>
      <div className='text-sm flex flex-col gap-4'>
        <ProductItem/>
        <ProductItem/>
        <ProductItem/>
        <ProductItem/>
      </div>
      <div className='flex justify-between'>
        <span className='text-sm'>9 Thêm hàng vào giỏ</span>
        <button className='bg-main-orange text-white rounded-sm px-2 py-1'>
          Xem Giỏ Hàng
        </button>
      </div>
    </div>
  )
}

export default CartPreview
