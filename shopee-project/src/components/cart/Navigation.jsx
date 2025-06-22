import React from 'react'
import shopeeLogo from '../../assets/ShopeeLogo.png'
import { FiSearch } from "react-icons/fi"

const Navigation = () => {
  return (
    <div className='flex justify-between px-32 py-4 items-center bg-white'>
      <div className='flex gap-4 items-center text-main-orange'>
        <img src={shopeeLogo} alt='img-logo' className='w-32 object-cover' />
        <span className='text-[1.75rem]'>|</span>
        <span className='text-[1.45rem] font-normal leading-none mt-2'>Giỏ hàng</span>
      </div>
      {/* Search Bar */}
      <div className="flex border-2 border-main-orange rounded-sm overflow-hidden w-[550px]">
        <input
          type="text"
          placeholder="Săn Deal Ăn Ngon Giảm 75.000Đ"
          className="flex-1 px-4 py-2 outline-none"
        />
        <button className="bg-main-orange px-6 flex items-center justify-center text-white">
          <FiSearch size={18} />
        </button>
      </div>
    </div>
  )
}

export default Navigation
