import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaClipboardList, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Bạn có thể import thêm các component như TimeLine, DeliveryTimeline nếu muốn tách UI chi tiết

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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
  }, [id]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    fetchOrderDetail();
  }, [currentUser, navigate, fetchOrderDetail]);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!order) return <div className="text-center py-10">Không tìm thấy đơn hàng</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex items-center mb-4">
          <Link to="/orders" className="text-[#f53d2d] hover:underline flex items-center">
            <FaArrowLeft className="mr-2" />
            Danh sách đơn hàng
          </Link>
          <h1 className="ml-6 text-xl font-bold">Đơn hàng #{order.order_id}</h1>
        </div>
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded bg-gray-200 text-gray-700">
            Trạng thái: {order.status}
          </span>
          <span className="ml-4 text-sm text-gray-500">Đặt lúc: {order.created_at}</span>
        </div>

        {/* Chi tiết sản phẩm */}
        <h2 className="font-semibold mb-2">Sản phẩm</h2>
        <ul className="space-y-3">
          {order.orderDetails.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center border-b pb-2">
              <div>{item.product?.name || "Sản phẩm không xác định"} x {item.quantity}</div>
              <div>{item.unit_price.toLocaleString()} đ</div>
            </li>
          ))}
        </ul>

        {/* Tổng tiền */}
        <div className="mt-4 font-semibold">
          Tổng tiền: <span className="text-[#f53d2d]">{order.total_amount.toLocaleString()} đ</span>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="mt-4">
          <h2 className="font-semibold mb-1">Địa chỉ giao hàng</h2>
          <div className="text-gray-600">{order.shipping_address}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
