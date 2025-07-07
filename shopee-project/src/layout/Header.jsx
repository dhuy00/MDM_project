import React from "react";
import { FaBell } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import logo from "../assets/ShopeeLogo.png";
import avatar from "../assets/LogoCoolmate.png";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center">

      <div className="flex items-center gap-3">
        <img src={logo} alt="Shop Logo" className="h-8 w-auto object-contain" />
        <a href="/seller/products" className="text-lg font-bold text-orange-500 hover:underline">
          Kênh Người Bán
        </a>
      </div>

      <div className="flex items-center gap-6">

        <button className="relative">
          <FaBell className="text-gray-600 text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            2
          </span>
        </button>


        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={avatar}
            alt="Avatar"
            className="w-8 h-8"
          />
          <span className="text-sm font-medium text-gray-700">Coolmate - Official Store</span>
          <IoMdArrowDropdown className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;
