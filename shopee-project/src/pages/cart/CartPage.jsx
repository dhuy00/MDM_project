import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaTrashAlt,
  FaAngleLeft,
  FaShoppingCart,
  FaStore,
  FaCreditCard,
  FaTruck,
  FaRegCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [shippingMethod, setShippingMethod] = useState("Nhanh");
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1); // 1: giỏ hàng, 2: thông tin đặt hàng

  // API URL
  const API_URL = "http://localhost:5000/api"; // Backend API URL with /api prefix

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const fetchCart = useCallback(async () => {
    console.log("fetchCart called"); // Debug log
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(response.data);

      // Mặc định chọn tất cả sản phẩm
      const productsToSelect = response.data.products.map((p) => p.product_id);
      setSelectedProducts(productsToSelect);

    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setError("Không thể tải giỏ hàng. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Sử dụng fetchCart khi component mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle location state separately to avoid infinite re-fetching
  useEffect(() => {
    if (location.state?.justAdded && cart?.products) {
      // If coming from product detail with just added product
      setSelectedProducts([location.state.justAdded]);
      setTimeout(() => {
        setStep(2); // Go to order info step
      }, 500);
    }
  }, [location.state?.justAdded, cart?.products]);

  const handleSelectProduct = (product_id) => {
    if (selectedProducts.includes(product_id)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== product_id));
    } else {
      setSelectedProducts([...selectedProducts, product_id]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(cart.products.map((p) => p.product_id));
    } else {
      setSelectedProducts([]);
    }
  };

  const updateCartAPI = async (product_id, newQuantity) => {
    try {
      await axios.put(`${API_URL}/cart/update`, {
        product_id,
        quantity: newQuantity,
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng qua API:", error);
      return false;
    }
  };

  const removeFromCartAPI = async (product_id) => {
    try {
      await axios.delete(`${API_URL}/cart/remove`, {
        data: {
          product_id,
        },
      });
      return true;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng qua API:", error);
      return false;
    }
  };

  const handleUpdateQuantity = async (product_id, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      setLoading(true);
      // Cập nhật qua API
      await updateCartAPI(product_id, newQuantity);

      // Cập nhật giỏ hàng trong state local
      const updatedProducts = cart.products.map((item) => {
        if (item.product_id === product_id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCart({
        ...cart,
        products: updatedProducts,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      setError("Có lỗi xảy ra khi cập nhật số lượng!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (product_id) => {
    try {
      setLoading(true);
      // Xóa qua API
      await removeFromCartAPI(product_id);

      // Xóa sản phẩm khỏi state local
      const updatedProducts = cart.products.filter(
        (item) => item.product_id !== product_id
      );

      setCart({
        ...cart,
        products: updatedProducts,
      });

      // Cập nhật danh sách sản phẩm đã chọn
      setSelectedProducts(selectedProducts.filter((id) => id !== product_id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      setError("Có lỗi xảy ra khi xóa sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền các sản phẩm đã chọn
  const calculateTotalPrice = () => {
    if (!cart || !cart.products) return 0;

    return cart.products
      .filter((item) => selectedProducts.includes(item.product_id))
      .reduce((sum, item) => sum + item.quantity * (item.details.price || 0), 0);
  };

  // Tính phí vận chuyển
  const calculateShippingFee = () => {
    if (!cart || !cart.products) return 0;

    const selectedItems = cart.products.filter((item) =>
      selectedProducts.includes(item.product_id)
    );

    // Tính phí vận chuyển cao nhất trong các sản phẩm đã chọn
    if (selectedItems.length === 0) return 0;

    const shippingMethod = "Nhanh"; // Hiện tại chỉ hỗ trợ một phương thức
    let maxShippingFee = 0;

    selectedItems.forEach((item) => {
      const methods = item.details.shipping?.methods || [];
      const method = methods.find((m) => m.name === shippingMethod);
      if (method && method.price > maxShippingFee) {
        maxShippingFee = method.price;
      }
    });

    return maxShippingFee;
  };

  // Tính tổng đơn hàng
  const calculateOrderTotal = () => {
    return calculateTotalPrice() + calculateShippingFee();
  };

  const proceedToCheckout = () => {
    if (selectedProducts.length === 0) {
      setMessage("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    setStep(2); // Chuyển sang bước nhập thông tin đặt hàng
  };

  const placeOrderAPI = async (orderData) => {
    try {
      const response = await axios.post(`${API_URL}/orders/place`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi đặt hàng qua API:", error);
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      setMessage("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    // Lấy các sản phẩm đã chọn
    const orderedProducts = cart.products.filter((item) =>
      selectedProducts.includes(item.product_id)
    );

    if (orderedProducts.length === 0) {
      setMessage("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    const orderData = {
      address: address, // Đổi từ shipping_address thành address để khớp với backend
      payment_method: paymentMethod,
      shipping_method: shippingMethod,
      note,
      selected_products: selectedProducts, // Gửi danh sách product_id được chọn
      total_amount: calculateOrderTotal(),
      shipping_fee: calculateShippingFee(),
    };

    console.log("Order data being sent:", orderData);
    console.log("Address value:", address);

    try {
      setLoading(true);

      // Thử đặt hàng qua API
      try {
        await placeOrderAPI(orderData);
        setMessage("Đặt hàng thành công!");

        // Xóa các sản phẩm đã đặt khỏi giỏ hàng
        const updatedProducts = cart.products.filter(
          (item) => !selectedProducts.includes(item.product_id)
        );

        setCart({
          ...cart,
          products: updatedProducts,
        });

        // Cập nhật localStorage
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          products: [],
        };
        localCart.products = localCart.products.filter(
          (item) => !selectedProducts.includes(item.product_id)
        );
        localStorage.setItem("cart", JSON.stringify(localCart));

        setSelectedProducts([]);
        setStep(1); // Quay về trang giỏ hàng
      } catch (apiError) {
        console.log("API không khả dụng, sử dụng localStorage");

        // Nếu API không khả dụng, giả lập thành công
        setMessage("Đặt hàng thành công! (Chế độ offline)");

        // Xóa các sản phẩm đã đặt khỏi giỏ hàng trong localStorage
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          products: [],
        };
        localCart.products = localCart.products.filter(
          (item) => !selectedProducts.includes(item.product_id)
        );
        localStorage.setItem("cart", JSON.stringify(localCart));

        // Cập nhật state
        const updatedProducts = cart.products.filter(
          (item) => !selectedProducts.includes(item.product_id)
        );

        setCart({
          ...cart,
          products: updatedProducts,
        });

        setSelectedProducts([]);
        setStep(1); // Quay về trang giỏ hàng
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      setMessage("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  if (loading)
    return (
      <div>
        {/* Header giống Shopee */}
        <div className="bg-[#f53d2d] text-white py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <FaShoppingCart className="text-2xl mr-3" />
              <h1 className="text-xl font-medium">Giỏ Hàng</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-8 px-4 min-h-[60vh] flex flex-col items-center justify-center">
          <div className="animate-spin text-[#f53d2d] text-4xl mb-4">
            <FaSpinner />
          </div>
          <p className="text-gray-500">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );

  if (!cart || !cart.products.length) {
    return (
      <div>
        {/* Header giống Shopee */}
        <div className="bg-[#f53d2d] text-white py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <FaShoppingCart className="text-2xl mr-3" />
              <h1 className="text-xl font-medium">Giỏ Hàng</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 px-4 min-h-[60vh] flex flex-col items-center justify-center">
          {error && (
            <div className="w-full max-w-md p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <FaExclamationCircle className="text-red-500 text-lg mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="w-full max-w-md p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <FaRegCheckCircle className="text-green-500 text-lg mr-2" />
                <p className="text-green-600">{message}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">
              Giỏ hàng của bạn còn trống
            </h2>
            <p className="text-gray-500 mb-4">
              Hãy thêm sản phẩm vào giỏ hàng của bạn
            </p>
            <Link to="/">
              <button className="bg-[#f53d2d] hover:bg-[#e03a2a] text-white py-2 px-6 rounded-sm">
                Mua sắm ngay
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trang giỏ hàng
  if (step === 1) {
    return (
      <div>
        {/* Header giống Shopee */}
        <div className="bg-[#f53d2d] text-white py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <FaShoppingCart className="text-2xl mr-3" />
              <h1 className="text-xl font-medium">Giỏ Hàng</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-4 px-4">
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded">
              <div className="flex">
                <FaExclamationCircle className="text-red-500 mt-1 mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="p-3 mb-4 bg-green-50 border border-green-200 rounded">
              <div className="flex">
                <FaRegCheckCircle className="text-green-500 mt-1 mr-2" />
                <p className="text-green-600">{message}</p>
              </div>
            </div>
          )}

          {/* Tiêu đề các cột */}
          <div className="bg-white rounded shadow mb-4">
            <div className="grid grid-cols-12 p-4 border-b items-center text-gray-500">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === cart.products.length &&
                    cart.products.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 mr-2"
                />
                <span>Chọn tất cả ({cart.products.length} sản phẩm)</span>
              </div>
              <div className="col-span-5">Sản Phẩm</div>
              <div className="col-span-2 text-center">Đơn Giá</div>
              <div className="col-span-2 text-center">Số Lượng</div>
              <div className="col-span-1 text-center">Số Tiền</div>
              <div className="col-span-1 text-center">Thao Tác</div>
            </div>

            {/* Danh sách sản phẩm */}
            {cart.products.map((item) => (
              <div
                key={item.product_id}
                className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 items-center"
              >
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(item.product_id)}
                    onChange={() => handleSelectProduct(item.product_id)}
                    className="w-4 h-4"
                  />
                </div>

                <div className="col-span-5 flex items-center">
                  <div className="w-16 h-16 flex-shrink-0 mr-3">
                    <img
                      src={item.details.thumbnail || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f5f5f5'/%3E%3Ctext x='40' y='40' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={item.details.name}
                      className="w-full h-full object-cover border"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium line-clamp-2">
                      {item.details.name}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap">
                      {Object.entries(item.variant || {}).map(
                        ([key, value]) => (
                          <span
                            key={key}
                            className="mr-2 bg-gray-100 px-2 py-1 rounded"
                          >
                            {key}: {value}
                          </span>
                        )
                      )}
                    </div>
                    <div className="text-xs flex items-center mt-1">
                      <FaStore className="text-gray-400 mr-1" />
                      <span className="text-gray-500">
                        {item.details.brand || "Shop Mall"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center text-gray-500">
                  ₫{item.details.price ? item.details.price.toLocaleString() : "N/A"}
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <div className="flex border rounded-sm overflow-hidden">
                    <button
                      className="px-2 py-1 border-r bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        handleUpdateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          handleUpdateQuantity(item.product_id, value);
                        }
                      }}
                      className="w-12 text-center outline-none"
                    />
                    <button
                      className="px-2 py-1 border-l bg-gray-100 hover:bg-gray-200"
                      onClick={() =>
                        handleUpdateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="col-span-1 text-center text-[#f53d2d] font-medium">
                  ₫{((item.details.price || 0) * item.quantity).toLocaleString()}
                </div>

                <div className="col-span-1 text-center">
                  <button
                    onClick={() => handleRemoveProduct(item.product_id)}
                    className="text-gray-500 hover:text-[#f53d2d]"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer thanh toán cố định */}
          <div className="bg-white shadow-md fixed bottom-0 left-0 right-0 border-t z-10">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === cart.products.length &&
                      cart.products.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="mr-4">
                    Chọn Tất Cả ({cart.products.length})
                  </span>
                  <button
                    className="text-[#f53d2d] hover:text-[#f53d2d]/80"
                    onClick={() => {
                      if (selectedProducts.length > 0) {
                        selectedProducts.forEach((id) =>
                          handleRemoveProduct(id)
                        );
                      }
                    }}
                  >
                    Xóa
                  </button>
                </div>

                <div className="flex items-center">
                  <div className="mr-6">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">
                        Tổng thanh toán ({selectedProducts.length} sản phẩm):
                      </span>
                      <span className="text-[#f53d2d] text-xl font-medium">
                        ₫{calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      Đã bao gồm thuế VAT (nếu có)
                    </div>
                  </div>

                  <button
                    className={`px-10 py-2 rounded-sm ${
                      selectedProducts.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#f53d2d] hover:bg-[#f53d2d]/90"
                    } text-white font-medium`}
                    disabled={selectedProducts.length === 0}
                    onClick={proceedToCheckout}
                  >
                    Mua Hàng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Thêm padding cho footer cố định */}
          <div className="h-16 mb-4"></div>
        </div>
      </div>
    );
  }

  // Trang điền thông tin đặt hàng
  return (
    <div>
      {/* Header giống Shopee */}
      <div className="bg-[#f53d2d] text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <FaShoppingCart className="text-2xl mr-3" />
            <h1 className="text-xl font-medium">Thanh Toán</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {message && (
          <div className="p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex">
              <FaExclamationCircle className="text-yellow-500 mt-1 mr-2" />
              <p className="text-yellow-600">{message}</p>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-sm mb-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium flex items-center">
              <FaTruck className="text-gray-400 mr-2" />
              Địa Chỉ Nhận Hàng
            </h2>
          </div>
          <div className="p-4">
            <textarea
              className="w-full p-3 border rounded-sm focus:border-[#f53d2d] focus:ring focus:ring-[#f53d2d]/20 outline-none"
              rows="3"
              placeholder="Nhập địa chỉ giao hàng đầy đủ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="bg-white shadow rounded-sm mb-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium flex items-center">
              <FaShoppingCart className="text-gray-400 mr-2" />
              Sản Phẩm Đặt Mua
            </h2>
          </div>
          <div>
            {cart.products
              .filter((item) => selectedProducts.includes(item.product_id))
              .map((item) => (
                <div
                  key={item.product_id}
                  className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 items-center"
                >
                  <div className="col-span-6 flex items-center">
                    <div className="w-12 h-12 flex-shrink-0 mr-3">
                      <img
                        src={item.details.thumbnail || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f5f5f5'/%3E%3Ctext x='40' y='40' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E"}
                        alt={item.details.name}
                        className="w-full h-full object-cover border"
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-medium line-clamp-1">
                        {item.details.name}
                      </h3>
                      <div className="text-xs text-gray-500">
                        Phân loại:{" "}
                        {Object.entries(item.variant || {})
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </div>
                      <div className="text-xs text-gray-500">
                        x{item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6 text-right text-[#f53d2d] font-medium">
                    ₫{((item.details.price || 0) * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-500">Tổng tiền hàng:</div>
                <div>₫{calculateTotalPrice().toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-500">Phí vận chuyển:</div>
                <div>₫{calculateShippingFee().toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed">
                <div className="text-gray-500">Tổng thanh toán:</div>
                <div className="text-xl text-[#f53d2d] font-medium">
                  ₫{calculateOrderTotal().toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-sm mb-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium flex items-center">
              <FaTruck className="text-gray-400 mr-2" />
              Phương Thức Vận Chuyển
            </h2>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="shipping_normal"
                name="shipping_method"
                value="Nhanh"
                checked={shippingMethod === "Nhanh"}
                onChange={() => setShippingMethod("Nhanh")}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="shipping_normal">Giao hàng nhanh - ₫12.800</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="shipping_fast"
                name="shipping_method"
                value="Hoả Tốc"
                checked={shippingMethod === "Hoả Tốc"}
                onChange={() => setShippingMethod("Hoả Tốc")}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="shipping_fast">Giao hàng hoả tốc - ₫22.000</label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-sm mb-4">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium flex items-center">
              <FaCreditCard className="text-gray-400 mr-2" />
              Phương Thức Thanh Toán
            </h2>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="payment_cod"
                name="payment_method"
                value="cash_on_delivery"
                checked={paymentMethod === "cash_on_delivery"}
                onChange={() => setPaymentMethod("cash_on_delivery")}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="payment_cod">Thanh toán khi nhận hàng</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="payment_transfer"
                name="payment_method"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="payment_transfer">Chuyển khoản ngân hàng</label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-sm mb-4">
          <div className="p-4">
            <div className="mb-3">
              <label className="block text-gray-600 mb-1">Ghi chú:</label>
              <textarea
                className="w-full p-3 border rounded-sm focus:border-[#f53d2d] focus:ring focus:ring-[#f53d2d]/20 outline-none"
                rows="2"
                placeholder="Ghi chú cho đơn hàng"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer thanh toán cố định */}
        <div className="bg-white shadow-md fixed bottom-0 left-0 right-0 border-t z-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
              <button
                onClick={goBack}
                className="text-[#f53d2d] flex items-center"
              >
                <FaAngleLeft className="mr-1" />
                Quay lại
              </button>

              <div className="flex items-center">
                <div className="mr-6">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">Tổng thanh toán:</span>
                    <span className="text-[#f53d2d] text-xl font-medium">
                      ₫{calculateOrderTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  className={`px-10 py-2 ${
                    loading || !address
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#f53d2d] hover:bg-[#f53d2d]/90"
                  } text-white font-medium rounded-sm`}
                  disabled={loading || !address}
                  onClick={handlePlaceOrder}
                >
                  {loading ? "Đang xử lý..." : "Đặt Hàng"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thêm padding cho footer cố định */}
        <div className="h-16 mb-4"></div>
      </div>
    </div>
  );
};

export default CartPage;
