import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaStore, 
  FaBox, 
  FaPlus, 
  FaChartBar, 
  FaStar, 
  FaShoppingCart,
  FaExclamationTriangle,
  FaSignOutAlt
} from "react-icons/fa";
import { useSellerAuth } from "../../context/SellerAuthContext";
import axios from "axios";

const SellerDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { currentSeller, logoutSeller } = useSellerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentSeller) {
      navigate("/seller/login");
      return;
    }

    fetchStats();
  }, [currentSeller, navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/seller/stats");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutSeller();
    navigate("/seller/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f53d2d]"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaStore className="text-[#f53d2d] text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                {currentSeller?.shop?.shop_name || "Seller Center"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Xin chào, {currentSeller?.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-[#f53d2d] border border-gray-300 rounded-lg hover:border-[#f53d2d] transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBox className="text-blue-500 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaShoppingCart className="text-green-500 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Còn hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inStockProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.outOfStockProducts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaStar className="text-yellow-400 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Đánh giá TB</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin shop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Tên shop</p>
              <p className="text-lg font-medium text-gray-900">
                {currentSeller?.shop?.shop_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Đánh giá shop</p>
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span className="text-lg font-medium text-gray-900">
                  {currentSeller?.shop?.rating || 0}
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Mô tả</p>
              <p className="text-gray-900">
                {currentSeller?.shop?.description || "Chưa có mô tả"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/seller/products")}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <FaBox className="text-[#f53d2d] text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Quản lý sản phẩm
                </h3>
                <p className="text-gray-600">
                  Xem và quản lý tất cả sản phẩm
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/seller/products/add")}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <FaPlus className="text-green-500 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thêm sản phẩm
                </h3>
                <p className="text-gray-600">
                  Tạo sản phẩm mới cho shop
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/seller/analytics")}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-center">
              <FaChartBar className="text-blue-500 text-2xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Thống kê
                </h3>
                <p className="text-gray-600">
                  Xem báo cáo và phân tích
                </p>
              </div>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
