import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBox,
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // API URL
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, [currentUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaSpinner className="text-yellow-500" />;
      case "confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      case "processing":
        return <FaBox className="text-orange-500" />;
      case "shipped":
        return <FaTruck className="text-purple-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "refunded":
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-orange-600 bg-orange-100";
      case "shipped":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FaSpinner className="animate-spin h-8 w-8 mx-auto mb-4 text-[#f53d2d]" />
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FaTimesCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-[#f53d2d] text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Link
              to="/"
              className="flex items-center text-[#f53d2d] hover:text-red-600 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Trang chủ
            </Link>
            <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
          </div>
          <p className="text-gray-600">
            Xem tất cả các đơn hàng bạn đã đặt trên Shopee
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-4">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              to="/"
              className="bg-[#f53d2d] text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="mr-3">{getStatusIcon(order.status)}</div>
                    <div>
                      <h3 className="font-semibold">
                        Đơn hàng #{order.order_id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                    <Link
                      to={`/orders/${order.order_id}`}
                      className="text-[#f53d2d] hover:text-red-600 flex items-center"
                    >
                      <FaEye className="mr-1" />
                      Chi tiết
                    </Link>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phương thức: {order.shipping_method}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Thanh toán</h4>
                      <p className="text-sm text-gray-600">
                        {order.payment_method === "cash_on_delivery"
                          ? "Thanh toán khi nhận hàng"
                          : order.payment_method === "credit_card"
                          ? "Thẻ tín dụng"
                          : order.payment_method}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-600">
                        Phí vận chuyển: {formatPrice(order.shipping_fee)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Tổng tiền: </span>
                      <span className="text-lg font-semibold text-[#f53d2d]">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  {order.note && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm">
                        <strong>Ghi chú:</strong> {order.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
