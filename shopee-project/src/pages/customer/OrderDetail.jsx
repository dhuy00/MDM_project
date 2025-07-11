import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCreditCard,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // API URL
  const API_URL = "http://localhost:5000/api";

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setOrder(response.data);
    } catch (err) {
      console.error("Error fetching order detail:", err);
      if (err.response?.status === 404) {
        setError("Không tìm thấy đơn hàng");
      } else {
        setError("Không thể tải chi tiết đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  }, [id, API_URL]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Refresh order data
      await fetchOrderDetail();
      alert("Hủy đơn hàng thành công!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    if (!window.confirm("Bạn có muốn đặt lại đơn hàng này?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/orders/${id}/reorder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Đặt lại đơn hàng thành công!");
      // Navigate to the new order
      navigate(`/orders/${response.data.order.order_id}`);
    } catch (err) {
      console.error("Error reordering:", err);
      alert(err.response?.data?.message || "Không thể đặt lại đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchOrderDetail();
  }, [currentUser, navigate, fetchOrderDetail]);

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
            <p>Đang tải chi tiết đơn hàng...</p>
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
            <Link
              to="/orders"
              className="bg-[#f53d2d] text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Không tìm thấy đơn hàng</p>
            <Link
              to="/orders"
              className="bg-[#f53d2d] text-white px-4 py-2 rounded hover:bg-red-600 mt-4 inline-block"
            >
              Quay lại danh sách đơn hàng
            </Link>
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
              to="/orders"
              className="flex items-center text-[#f53d2d] hover:text-red-600 mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Danh sách đơn hàng
            </Link>
            <h1 className="text-2xl font-bold">
              Chi tiết đơn hàng #{order.order_id}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="mr-3">{getStatusIcon(order.status)}</div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusText(order.status)}
            </span>
            <span className="ml-4 text-sm text-gray-600">
              Đặt hàng lúc: {formatDate(order.created_at)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaClipboardList className="mr-2" />
                Sản phẩm đã đặt
              </h2>
              <div className="space-y-4">
                {order.orderDetails && order.orderDetails.length > 0 ? (
                  order.orderDetails.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center border-b pb-4 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                        {item.product?.thumbnail ? (
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <FaBox className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {item.product?.name || "Sản phẩm không xác định"}
                        </h3>
                        {item.product?.brand && (
                          <p className="text-sm text-gray-600">
                            Thương hiệu: {item.product.brand}
                          </p>
                        )}
                        {item.variant && (
                          <p className="text-sm text-gray-600">
                            Phân loại: {JSON.stringify(item.variant)}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.unit_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tổng: {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Không có thông tin sản phẩm</p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                Địa chỉ giao hàng
              </h2>
              <div className="space-y-2">
                <p className="font-medium flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  {currentUser?.username || "Khách hàng"}
                </p>
                <p className="text-gray-600">{order.shipping_address}</p>
                <p className="text-sm text-gray-500">
                  Phương thức vận chuyển: {order.shipping_method}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FaCreditCard className="mr-2" />
                Phương thức thanh toán
              </h2>
              <p className="text-gray-600">
                {order.payment_method === "cash_on_delivery"
                  ? "Thanh toán khi nhận hàng"
                  : order.payment_method === "credit_card"
                  ? "Thẻ tín dụng"
                  : order.payment_method}
              </p>
            </div>

            {/* Order Note */}
            {order.note && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Ghi chú</h2>
                <p className="text-gray-600">{order.note}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Tổng quan đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>
                    {formatPrice(order.total_amount - order.shipping_fee)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{formatPrice(order.shipping_fee)}</span>
                </div>
                {order.coupon_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giảm giá:</span>
                    <span className="text-green-600">{order.coupon_code}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-[#f53d2d]">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {order.status === "pending" && (
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Đơn hàng của bạn đang chờ xác nhận
                  </p>
                  <button
                    className="w-full bg-red-100 text-red-600 py-2 px-4 rounded hover:bg-red-200"
                    onClick={handleCancelOrder}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Hủy đơn hàng"}
                  </button>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="mt-6 pt-4 border-t">
                  <button
                    className="w-full bg-[#f53d2d] text-white py-2 px-4 rounded hover:bg-red-600"
                    onClick={handleReorder}
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Đặt lại đơn hàng"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
