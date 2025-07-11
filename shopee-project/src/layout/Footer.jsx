import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white pt-10 pb-5 border-t text-gray-600 text-sm">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-gray-700 mb-4">CUSTOMER SERVICE</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="hover:text-[#f53d2d]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/how-to-buy" className="hover:text-[#f53d2d]">
                  How to Buy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[#f53d2d]">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#f53d2d]">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f53d2d]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Shopee */}
          <div>
            <h3 className="font-bold text-gray-700 mb-4">ABOUT SHOPEE</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-[#f53d2d]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#f53d2d]">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-[#f53d2d]">
                  Shopee Policies
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#f53d2d]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/seller" className="hover:text-[#f53d2d]">
                  Sell on Shopee
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-bold text-gray-700 mb-4">PAYMENT</h3>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">
                    Card {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics */}
          <div>
            <h3 className="font-bold text-gray-700 mb-4">LOGISTICS</h3>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center"
                >
                  <span className="text-xs text-gray-400">
                    Ship {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-gray-700 mb-4">FOLLOW US</h3>
            <div className="flex space-x-3">
              <a href="#" className="hover:text-[#f53d2d]">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="hover:text-[#f53d2d]">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-[#f53d2d]">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-[#f53d2d]">
                <FaYoutube className="text-xl" />
              </a>
              <a href="#" className="hover:text-[#f53d2d]">
                <FaLinkedin className="text-xl" />
              </a>
            </div>

            <h3 className="font-bold text-gray-700 mt-6 mb-4">
              SHOPEE APP DOWNLOAD
            </h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="h-10 w-32 bg-gray-100 rounded flex items-center justify-center"
              >
                <span className="text-xs">App Store</span>
              </a>
              <a
                href="#"
                className="h-10 w-32 bg-gray-100 rounded flex items-center justify-center"
              >
                <span className="text-xs">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-5 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              © 2023 Shopee. All Rights Reserved.
            </div>
            <div>
              <div className="text-center md:text-right text-xs">
                Country & Region: Singapore | Indonesia | Taiwan | Thailand |
                Malaysia | Vietnam | Philippines | Brazil | México | Colombia |
                Chile
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
