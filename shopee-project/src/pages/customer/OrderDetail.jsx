import React from 'react'
import Navigation from '../../components/order/Navigation'
import { FaRegBell, FaRegUser, FaStore } from 'react-icons/fa'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { BsCoin } from 'react-icons/bs'
import { IoChevronBack } from "react-icons/io5";
import TimeLine from '../../components/order/TimeLine'
import DeliveryTimeline from '../../components/order/DeliveryTimeline'
import Summary from '../../components/order/Summary'

const OrderDetail = () => {
  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-[#f5f5f5] px-32 text-[#333] flex">
        {/* Sidebar */}
        <div className="w-[240px] bg-white p-6 border-r">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div className="font-semibold">huyvc816</div>
            <button className="text-blue-500 text-xs">Sửa Hồ Sơ</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaRegBell /> Thông Báo
            </div>
            <div className="flex items-center gap-2">
              <FaRegUser /> Tài Khoản Của Tôi
            </div>
            <div className="flex items-center gap-2 text-[#f53d2d] font-medium">
              <FaStore /> Đơn Mua
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineLocalOffer /> Kho Voucher
            </div>
            <div className="flex items-center gap-2">
              <BsCoin /> Shopee Xu
            </div>
            <div className="flex items-center gap-2">
              <img src="https://cf.shopee.vn/file/8f9261bc7256d66fdc92e3980e64c978" alt="sale" className="w-5 h-5" />
              25.6 Lượng Vé Sale Tới <span className="text-xs text-red-500 font-bold ml-1">New</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='w-full flex items-center flex-col mt-4 gap-[2px]'>
          {/* Header */}
          <div className='flex justify-between w-full items-center bg-white py-3 px-4 text-sm 
          font-medium text-gray-500'>
            <span className='flex gap-2 items-center'>
              <IoChevronBack />
              <span>TRỞ LẠI</span>
            </span>
            <div className='flex gap-2'>
              <span>MÃ ĐƠN HÀNG. 250303MECW1Q3G</span>
              <span>|</span>
              <span className='text-main-orange'>ĐƠN HÀNG ĐÃ HOÀN THÀNH</span>
            </div>
          </div>
          {/* Timeline */}
          <TimeLine />
          {/* Purchase Again */}
          <div className='flex justify-between items-center bg-orange-50 w-full py-4 px-4'>
            <span className='text-sm'>Cảm ơn bạn đã mua sắm tại Shopee</span>
            <button className='bg-main-orange px-20 py-[8px] rounded-sm text-white'>
              Mua lại
            </button>
          </div>
          {/* Contact Seller */}
          <div className='flex justify-end items-center bg-orange-50 w-full py-4 px-4'>
            <button className=' w-[212px] py-[8px] rounded-sm bg-white border'>
              Liên Hệ Người Bán
            </button>
          </div>
          <DeliveryTimeline/>
          <Summary/>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
