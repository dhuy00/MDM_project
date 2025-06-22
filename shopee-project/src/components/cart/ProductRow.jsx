import React, { useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

const ProductRow = ({ product }) => {
  const [quantity, setQuantity] = useState(product.quantity || 1)

  const handleChange = (type) => {
    let newQty = quantity
    if (type === 'inc') newQty++
    else if (type === 'dec' && quantity > 1) newQty--

    setQuantity(newQty)
  }

  return (
    <div className='px-8 py-4 flex gap-4 items-start'>
      <input type='checkbox' className='w-4 h-4 mt-2' />

      <img src={product.image} alt='img-product' className='w-20 h-20 object-cover rounded-sm' />

      <div className='flex flex-col gap-1 w-[300px]'>
        <span className='font-medium leading-snug'>{product.name}</span>
        {product.label && (
          <span className='text-xs border border-red-500 w-fit text-red-500 px-1 rounded-sm'>
            {product.label}
          </span>
        )}
      </div>

      <div className='text-[#888] flex flex-col gap-1'>
        <span>Phân Loại Hàng:</span>
        <span className='text-[#222]'>{product.category}</span>
      </div>

      <div className='flex flex-col gap-1 ml-auto text-right'>
        <div className='flex gap-2 items-center justify-end'>
          <span className='text-[#888] line-through'>₫{product.originalPrice.toLocaleString()}</span>
          <span>₫{product.discountedPrice.toLocaleString()}</span>
        </div>
        <span className='text-xs text-red-500'>Giá trên Live</span>
      </div>

      <div className='flex items-center border rounded ml-4'>
        <button onClick={() => handleChange('dec')} className='px-2'>-</button>
        <input type='text' value={quantity} readOnly className='w-8 text-center border-x outline-none' />
        <button onClick={() => handleChange('inc')} className='px-2'>+</button>
      </div>

      <div className='flex flex-col items-end justify-between ml-4 h-[64px]'>
        <span className='text-red-500 font-medium'>
          ₫{(product.discountedPrice * quantity).toLocaleString()}
        </span>
      </div>

      <div className='flex flex-col text-red-500 items-center text-sm'>
        <button className='hover:underline text-black'>Xóa</button>
        <button className='hover:underline flex items-center gap-1 max-w-32'>
          Tìm sản phẩm tương tự <MdKeyboardArrowDown size={14} />
        </button>
      </div>
    </div>
  )
}

export default ProductRow
