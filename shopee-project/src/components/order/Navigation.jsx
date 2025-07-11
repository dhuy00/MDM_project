import React, { useState } from 'react'
import shopeeLogo from '../../assets/ShopeeLogoWhite.png'
import { FiSearch } from "react-icons/fi"
import { IoCartOutline } from "react-icons/io5";
import CartPreview from '../cart/CartPreview';

const Navigation = () => {
  const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);

  const handleToggleCartPreview = () => {
    setIsCartPreviewOpen(!isCartPreviewOpen);
  }

  return (
    <div className='flex justify-between px-32 py-4 items-center bg-main-orange'>
      <div className='flex gap-4 items-center text-main-orange'>
        <img src={shopeeLogo} alt='img-logo' className='w-36 object-cover' />
      </div>
      {/* Search Bar */}
      <div>
        <div className="flex border-2 border-main-orange overflow-hidden">
          <input
            type="text"
            placeholder="Săn Deal Ăn Ngon Giảm 75.000Đ"
            className="flex-1 px-4 py-2 outline-none rounded-l-sm w-[750px]"
          />
          <button className="bg-main-orange px-6 flex items-center justify-center text-white rounded-r-sm border-white border-[2px]">
            <FiSearch size={18} />
          </button>
        </div>
        <div className='flex gap-4 text-white text-sm mt-2'>
          <span>Ốp Nubia Neo 3</span>
          <span>Bàn Phím Cơ</span>
          <span>Bọt Cạo Râu</span>
          <span>Vali Khung Nhôm</span>
          <span>Wk87</span>
        </div>
      </div>
      <div className='pr-12 relative cursor-pointer' onClick={handleToggleCartPreview}>
        <IoCartOutline className='text-[2rem] text-white'/>
        <div className='w-fit h-fit px-1 py-1 rounded-full absolute
         text-main-orange bg-white -top-2 text-xs right-10'>
          14
        </div>
        {isCartPreviewOpen && <CartPreview/>}
      </div>
    </div>
  )
}

export default Navigation
