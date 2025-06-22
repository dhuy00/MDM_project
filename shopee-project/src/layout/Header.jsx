import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaBell,
  FaQuestionCircle,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import ShopeeIcon from "../assets/icon";

const Header = () => {
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
              <Link to="/login" className="hover:opacity-80">
                Login
              </Link>
              <span className="mx-1">|</span>
              <Link to="/signup" className="hover:opacity-80">
                Sign Up
              </Link>
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
