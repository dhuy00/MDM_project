import React from 'react'
import { FaFacebook, FaInstagramSquare, FaUserCircle } from "react-icons/fa"
import { IoMdNotificationsOutline } from "react-icons/io"
import { GoQuestion } from "react-icons/go"
import { RiGlobalLine } from "react-icons/ri"

const HeaderItem = ({ icon: Icon, label }) => (
  <div className="flex gap-1 items-center cursor-pointer hover:opacity-80">
    {Icon && <Icon />}
    <span>{label}</span>
  </div>
)

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-main-orange text-white px-32 text-sm py-2">
      
      {/* Left Side */}
      <div className="flex gap-1 items-center">
        <span>Kênh Người Bán</span>
        <span>|</span>
        <span>Tải ứng dụng</span>
        <span>|</span>
        <span>Kết nối</span>
        <FaFacebook />
        <FaInstagramSquare />
      </div>

      {/* Right Side */}
      <div className="flex gap-4 items-center">
        <HeaderItem icon={IoMdNotificationsOutline} label="Thông Báo" />
        <HeaderItem icon={GoQuestion} label="Hỗ trợ" />
        <HeaderItem icon={RiGlobalLine} label="Tiếng Việt" />
        <HeaderItem icon={FaUserCircle} label="huyv3451" />
      </div>
      
    </div>
  )
}

export default Header
