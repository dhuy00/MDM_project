import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
import { formatPrice, getStarRatingArray } from "../../utils/productUtils";
import { useAuth } from "../../context/AuthContext";

const Product = () => {
  // State for product quantity
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();

  // API URL
  const API_URL = "http://localhost:5000/api"; // Backend API URL with /api prefix

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      // Check if ID is valid
      if (!id) {
        setError("Product ID is missing");
        setIsLoadingProduct(false);
        return;
      }

      // Basic validation for MongoDB ObjectId format (24 hex characters)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(id)) {
        setError("Invalid product ID format");
        setIsLoadingProduct(false);
        return;
      }

      setIsLoadingProduct(true);
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);

        // Fetch similar products
        const similarResponse = await axios.get(
          `${API_URL}/products/similar/${id}`
        );
        setSimilarProducts(similarResponse.data);
      } catch (err) {
        console.error("Failed to fetch product data:", err);
        if (err.response?.status === 400) {
          setError("Invalid product ID");
        } else if (err.response?.status === 404) {
          setError("Product not found");
        } else {
          setError("Failed to load product data");
        }
      } finally {
        setIsLoadingProduct(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Selected image state
  const [selectedImage, setSelectedImage] = useState(0);

  // Selected color and variation
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariation, setSelectedVariation] = useState("");

  // Set default selections when product data is loaded
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }

      if (product.variations && product.variations.length > 0) {
        setSelectedVariation(product.variations[0]);
      }
    }
  }, [product]);

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

  // Tạo đối tượng giỏ hàng
  const createCartItem = () => {
    return {
      product_id: product._id,
      quantity,
      variant: {
        Color: selectedColor,
        Variation: selectedVariation,
      },
    };
  };

  // Kiểm tra xác thực người dùng
  const checkAuthentication = () => {
    if (!currentUser) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      navigate("/login");
      return false;
    }
    return true;
  };

  // Kết nối với API backend để thêm vào giỏ hàng
  const addToCartAPI = async (cartItem) => {
    try {
      setLoading(true);

      // Kiểm tra kết nối internet
      if (!navigator.onLine) {
        throw new Error(
          "Không có kết nối internet. Vui lòng kiểm tra kết nối của bạn."
        );
      }

      const response = await axios.post(`${API_URL}/cart/add`, cartItem, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: 10000, // 10 giây timeout
      });

      // Kiểm tra response có thành công không
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server trả về lỗi: ${response.status}`);
      }

      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi thêm vào giỏ hàng qua API:", error);

      // Xử lý các loại lỗi khác nhau
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra server có đang chạy không."
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Kết nối quá chậm, vui lòng thử lại.");
      } else if (error.response) {
        // Server trả về response nhưng có lỗi
        const status = error.response.status;
        const message =
          error.response.data?.message ||
          error.response.data?.error ||
          "Có lỗi xảy ra";
        throw new Error(`Lỗi ${status}: ${message}`);
      } else {
        throw new Error(error.message || "Có lỗi không xác định xảy ra");
      }
    }
  };

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Kiểm tra sản phẩm có tồn tại
    if (!product) {
      alert("Không thể thêm sản phẩm vào giỏ hàng!");
      return;
    }

    const cartItem = createCartItem();

    try {
      setLoading(true);
      // Gọi API thêm vào giỏ hàng
      const result = await addToCartAPI(cartItem);

      // Chỉ hiển thị thông báo thành công khi thực sự thành công
      if (result) {
        setAddedToCart(true);
        alert("✅ Đã thêm sản phẩm vào giỏ hàng thành công!");

        setTimeout(() => {
          setAddedToCart(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    // Kiểm tra đăng nhập
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Kiểm tra sản phẩm có tồn tại
    if (!product) {
      alert("Không thể mua sản phẩm này!");
      return;
    }

    const cartItem = createCartItem();

    try {
      setLoading(true);
      // Gọi API thêm vào giỏ hàng
      const result = await addToCartAPI(cartItem);

      // Chỉ chuyển trang khi thực sự thành công
      if (result) {
        // Chuyển đến trang giỏ hàng và tự động chọn sản phẩm vừa thêm
        navigate("/cart", { state: { justAdded: cartItem.product_id } });
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Only calculate star rating when product is loaded
  const ratingStars = product ? getStarRatingArray(product.rating) : [];

  // Show loading state if product is loading
  if (isLoadingProduct) {
    return (
      <div className="bg-white p-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f53d2d] mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state if product failed to load
  if (error) {
    return (
      <div className="bg-white p-8 text-center min-h-screen flex flex-col justify-center">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <Link to="/" className="text-[#f53d2d] hover:underline">
          Return to Home Page
        </Link>
      </div>
    );
  }

  // Show message if product doesn't exist
  if (!product) {
    return (
      <div className="bg-white p-8 text-center min-h-screen flex flex-col justify-center">
        <div className="text-xl mb-4">Product not found</div>
        <Link to="/" className="text-[#f53d2d] hover:underline">
          Return to Home Page
        </Link>
      </div>
    );
  }

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
                  src={
                    product.images && product.images.length > 0
                      ? product.images[selectedImage]
                      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f5f5f5'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {product.images &&
                  product.images.map((img, index) => (
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
                      {product.rating || 0}
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
                  <div>{product.reviews || 0} Reviews</div>
                  <div className="mx-3 h-4 w-px bg-gray-300"></div>
                  <div>{product.sold || 0} Sold</div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-[#fafafa] p-4 mb-4">
                <div className="flex items-center">
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm mr-3">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-[#f53d2d] text-2xl font-medium">
                    {formatPrice(product.price)}
                  </span>
                  {product.discount && (
                    <span className="ml-3 bg-[#f53d2d] text-white text-xs px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Variations */}
              <div className="mb-4">
                {product.colors && product.colors.length > 0 && (
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
                )}

                {product.variations && product.variations.length > 0 && (
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
                )}
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
                <button
                  className="flex-1 bg-[#fef6f5] border border-[#f53d2d] text-[#f53d2d] py-2 px-4 rounded flex items-center justify-center"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  <FaShoppingCart className="mr-2" />
                  {loading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
                </button>
                <button
                  className="flex-1 bg-[#f53d2d] text-white py-2 px-4 rounded"
                  onClick={handleBuyNow}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Mua ngay"}
                </button>
              </div>

              {addedToCart && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <span className="block sm:inline">
                    Đã thêm sản phẩm vào giỏ hàng!
                  </span>
                </div>
              )}

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
      {product.seller && (
        <div className="bg-white p-4 mb-3">
          <div className="container mx-auto">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                <FaStore />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{product.seller.name || "Shop"}</h3>
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
                  <div className="font-medium">
                    {product.seller.rating || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Products</div>
                  <div className="font-medium">1.5k+</div>
                </div>
                <div>
                  <div className="text-gray-500">Response Rate</div>
                  <div className="font-medium">
                    {product.seller.responseRate || "N/A"}
                    {product.seller.responseRate ? "%" : ""}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Response Time</div>
                  <div className="font-medium">
                    {product.seller.responseTime || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Specifications */}
      <div className="bg-white p-4 mb-3">
        <div className="container mx-auto">
          <h2 className="text-xl mb-4">Product Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications && Array.isArray(product.specifications) ? (
              product.specifications.map((spec, index) => (
                <div key={index} className="flex">
                  <div className="w-32 text-gray-500">{spec.name}</div>
                  <div className="flex-1">{spec.value}</div>
                </div>
              ))
            ) : (
              <div>
                {product.specifications &&
                  typeof product.specifications === "object" &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-1">
                      <div className="w-32 text-gray-500">{key}</div>
                      <div className="flex-1">{String(value)}</div>
                    </div>
                  ))}
              </div>
            )}
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
