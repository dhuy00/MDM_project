import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaBell,
  FaQuestionCircle,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaChevronDown,
} from "react-icons/fa";
import ShopeeIcon from "../assets/icon";
import { useAuth } from "../context/AuthContext";
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
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="w-full">
      {/* Top header - light background */}
      <div className="bg-[#f53d2d] text-white py-1">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex space-x-4 text-xs">
            <Link to="/seller-center" className="hover:opacity-80">
              Seller Center
            </Link>
            <span>|</span>
            <Link to="/download" className="hover:opacity-80">
              Download
            </Link>
            <span>|</span>
            <div className="flex items-center">
              Follow us
              <div className="flex space-x-2 ml-2">
                <Link to="#" className="hover:opacity-80">
                  FB
                </Link>
                <Link to="#" className="hover:opacity-80">
                  IG
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <FaBell className="mr-1" />
              <Link to="/notifications" className="hover:opacity-80">
                Notifications
              </Link>
            </div>
            <div className="flex items-center">
              <FaQuestionCircle className="mr-1" />
              <Link to="/help" className="hover:opacity-80">
                Help
              </Link>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-1" />
              {currentUser ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center hover:opacity-80"
                  >
                    <span className="mr-1">Hello, {currentUser.username}</span>
                    <FaChevronDown className="text-xs" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaClipboardList className="mr-2" />
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="hover:opacity-80">
                    Login
                  </Link>
                  <span className="mx-1">|</span>
                  <Link to="/register" className="hover:opacity-80">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header - bright orange with search */}
      <div className="bg-[#f53d2d] text-white py-4 shadow-md">
        <div className="container mx-auto flex items-center px-4">
          <Link to="/" className="mr-8">
            <ShopeeIcon className="h-10 w-auto text-white" fill="#ffffff" />
          </Link>

          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Register and get up to 90% OFF voucher"
                className="w-full py-2 px-4 rounded-sm text-gray-800 focus:outline-none"
              />
              <button className="absolute right-0 top-0 bottom-0 bg-[#fb5533] px-4 rounded-r-sm hover:opacity-90">
                <FaSearch className="text-white" />
              </button>
            </div>

            <div className="flex mt-2 space-x-3 text-xs text-white/90">
              <Link to="/search?q=phone" className="hover:text-white">
                Phone
              </Link>
              <Link to="/search?q=dress" className="hover:text-white">
                Dress
              </Link>
              <Link to="/search?q=shoes" className="hover:text-white">
                Shoes
              </Link>
              <Link to="/search?q=bag" className="hover:text-white">
                Bag
              </Link>
              <Link to="/search?q=beauty" className="hover:text-white">
                Beauty
              </Link>
              <Link to="/search?q=laptop" className="hover:text-white">
                Laptop
              </Link>
              <Link to="/search?q=watch" className="hover:text-white">
                Watch
              </Link>
            </div>
          </div>

          <div className="ml-6">
            <Link to="/cart" className="relative flex items-center text-white">
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-white text-[#f53d2d] rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
