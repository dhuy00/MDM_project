import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaStore,
  FaChevronRight,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import {
  mockProduct,
  generateSimilarProducts,
  formatPrice,
  getStarRatingArray,
} from "../../utils/productUtils";

const Product = () => {
  // State for product quantity
  const [quantity, setQuantity] = useState(1);

  // Get data from productUtils
  const product = mockProduct;
  const similarProducts = generateSimilarProducts(6);

  // Selected image state
  const [selectedImage, setSelectedImage] = useState(0);

  // Selected color and variation
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations[0]
  );

  // Handle quantity change
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  // Get star rating array
  const ratingStars = getStarRatingArray(product.rating);

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Breadcrumbs */}
      <div className="bg-white py-2 shadow-sm mb-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-[#f53d2d]">
              Home
            </Link>
            <FaChevronRight className="mx-2 text-xs" />
            <Link to="/category/electronics" className="hover:text-[#f53d2d]">
              Electronics
            </Link>
            <FaChevronRight className="mx-2 text-xs" />
            <Link to="/category/audio" className="hover:text-[#f53d2d]">
              Audio
            </Link>
            <FaChevronRight className="mx-2 text-xs" />
            <span className="truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="md:w-5/12 md:pr-6">
              {/* Main Image */}
              <div className="w-full h-[400px] mb-3 border">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 border cursor-pointer ${
                      index === selectedImage
                        ? "border-[#f53d2d]"
                        : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={img}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* Share & Save */}
              <div className="flex items-center mt-4 space-x-4">
                <div className="flex items-center">
                  <button className="flex items-center text-gray-500 hover:text-[#f53d2d]">
                    <FaHeart className="mr-1" />
                    <span>Save</span>
                  </button>
                </div>
                <div className="text-gray-500">Share:</div>
                <div className="flex space-x-2">
                  {/* Social Icons would go here */}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-7/12 mt-6 md:mt-0">
              {/* Product Name and Tags */}
              <div className="mb-3">
                <h1 className="text-xl font-medium">{product.name}</h1>
                <div className="flex items-center mt-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-[#f53d2d] font-medium">
                      {product.rating}
                    </span>
                    <div className="flex ml-1">
                      {ratingStars.map((type, i) => (
                        <FaStar
                          key={i}
                          className={
                            type === "full" ? "text-[#f53d2d]" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mx-3 h-4 w-px bg-gray-300"></div>
                  <div>{product.reviews} Reviews</div>
                  <div className="mx-3 h-4 w-px bg-gray-300"></div>
                  <div>{product.sold} Sold</div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-[#fafafa] p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-500 line-through text-sm mr-3">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[#f53d2d] text-2xl font-medium">
                    {formatPrice(product.price)}
                  </span>
                  <span className="ml-3 bg-[#f53d2d] text-white text-xs px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
              </div>

              {/* Variations */}
              <div className="mb-4">
                <div className="mb-3">
                  <div className="text-gray-500 mb-2">Color</div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`px-3 py-1 border ${
                          selectedColor === color
                            ? "border-[#f53d2d] text-[#f53d2d]"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-gray-500 mb-2">Variation</div>
                  <div className="flex flex-wrap gap-2">
                    {product.variations.map((variation) => (
                      <button
                        key={variation}
                        className={`px-3 py-1 border ${
                          selectedVariation === variation
                            ? "border-[#f53d2d] text-[#f53d2d]"
                            : "border-gray-300"
                        }`}
                        onClick={() => setSelectedVariation(variation)}
                      >
                        {variation}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <div className="text-gray-500 mb-2">Quantity</div>
                <div className="flex items-center">
                  <button
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center"
                    onClick={decrementQuantity}
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-12 h-8 text-center border-t border-b border-gray-300"
                  />
                  <button
                    className="w-8 h-8 border border-gray-300 flex items-center justify-center"
                    onClick={incrementQuantity}
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Buy Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button className="flex-1 bg-[#fef6f5] border border-[#f53d2d] text-[#f53d2d] py-2 px-4 rounded flex items-center justify-center">
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-[#f53d2d] text-white py-2 px-4 rounded">
                  Buy Now
                </button>
              </div>

              {/* Guarantee */}
              <div className="border-t pt-4 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FaShieldAlt className="mr-2" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center">
                  <FaTruck className="mr-2" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="mr-2" />
                  <span>7 Days Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <FaStore />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{product.seller.name}</h3>
              <div className="flex mt-1 text-sm">
                <button className="border border-[#f53d2d] text-[#f53d2d] px-3 py-1 mr-3 text-sm rounded">
                  Visit Store
                </button>
                <button className="border border-gray-300 text-gray-500 px-3 py-1 text-sm rounded">
                  Follow
                </button>
              </div>
            </div>
            <div className="hidden md:flex space-x-8 text-sm">
              <div>
                <div className="text-gray-500">Rating</div>
                <div className="font-medium">{product.seller.rating}</div>
              </div>
              <div>
                <div className="text-gray-500">Products</div>
                <div className="font-medium">1.5k+</div>
              </div>
              <div>
                <div className="text-gray-500">Response Rate</div>
                <div className="font-medium">
                  {product.seller.responseRate}%
                </div>
              </div>
              <div>
                <div className="text-gray-500">Response Time</div>
                <div className="font-medium">{product.seller.responseTime}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex">
                <div className="w-32 text-gray-500">{spec.name}</div>
                <div className="flex-1">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">Product Description</h2>
          <p className="whitespace-pre-line">{product.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">Product Reviews ({product.reviews})</h2>
          <div className="flex items-center mb-4">
            <div className="text-3xl text-[#f53d2d] font-medium">
              {product.rating}
            </div>
            <div className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={24}
                  className={
                    i < Math.floor(product.rating)
                      ? "text-[#f53d2d]"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          <div className="py-6 text-center border-t border-b">
            <p>No reviews yet for this product</p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <div className="bg-white p-4">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {similarProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="border border-gray-200 p-2 hover:shadow-md transition-shadow"
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
    </div>
  );
};

export default Product;
