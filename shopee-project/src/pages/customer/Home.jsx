import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFire } from "react-icons/fa";
import {
  mockCategories,
  generateFlashSaleProducts,
  generateRecommendedProducts,
  formatPrice,
} from "../../utils/productUtils";

const Home = () => {
  // Get data from productUtils
  const categories = mockCategories;
  const flashSaleProducts = generateFlashSaleProducts(6);
  const recommendedProducts = generateRecommendedProducts(24);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner Carousel */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-4 px-4">
          <div className="w-full h-[300px] bg-[#f53d2d] rounded-lg relative overflow-hidden">
            <img
              src="https://cf.shopee.sg/file/sg-11134201-22120-nza33g8qbelvb5"
              alt="Shopee Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === 0 ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-6 px-4">
          <h2 className="text-lg font-medium mb-4">Popular Categories</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                key={category.id}
                className="flex flex-col items-center hover:text-[#f53d2d]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-[80px] h-[80px] rounded-lg object-cover mb-2"
                />
                <span className="text-xs text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaFire className="text-[#f53d2d] mr-2" />
              <h2 className="text-lg font-medium text-[#f53d2d]">FLASH SALE</h2>
            </div>
            <Link
              to="/flash-sale"
              className="text-sm text-[#f53d2d] flex items-center"
            >
              See All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-4 space-x-4">
            {flashSaleProducts.map((product) => (
              <div
                key={product.id}
                className="min-w-[180px] bg-white border border-gray-100 rounded-sm p-2 flex flex-col"
              >
                <div className="relative mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-[#f53d2d] text-white text-xs px-1 py-0.5">
                    {product.discount}% OFF
                  </div>
                </div>
                <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center space-x-1 mt-auto">
                  <span className="text-[#f53d2d] font-medium">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-400 text-xs line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="w-full bg-white">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recommended For You</h2>
            <Link
              to="/recommendations"
              className="text-sm text-[#f53d2d] flex items-center"
            >
              See All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {recommendedProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="bg-white border border-gray-100 rounded-sm p-2 hover:shadow-md transition-shadow"
              >
                <div className="mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[180px] object-cover"
                  />
                </div>
                <h3 className="text-sm mb-1 line-clamp-2 h-10">
                  {product.name}
                </h3>
                <div className="text-[#f53d2d] font-medium">
                  {formatPrice(product.price)}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {product.sold} sold
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Load More Button */}
      <div className="w-full py-6 flex justify-center">
        <button className="bg-white text-[#f53d2d] border border-[#f53d2d] px-8 py-2 rounded hover:bg-[#fef6f5] transition-colors">
          Load More
        </button>
      </div>
    </div>
  );
};

export default Home;
