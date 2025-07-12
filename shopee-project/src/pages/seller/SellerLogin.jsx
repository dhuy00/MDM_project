import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaStore, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSellerAuth } from "../../context/SellerAuthContext";
import shopeeLogo from "../../assets/ShopeeLogo.png";

const SellerLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginSeller } = useSellerAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginSeller(formData.username, formData.password);
      
      if (result.success) {
        navigate("/seller/dashboard");
      } else {
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f53d2d] to-[#ff6b35] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={shopeeLogo} alt="Shopee" className="w-32 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Seller Center</h1>
          <p className="text-gray-600">Đăng nhập vào tài khoản bán hàng</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email hoặc Số điện thoại
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập email hoặc số điện thoại"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#f53d2d] hover:bg-[#e63946] focus:ring-2 focus:ring-[#f53d2d] focus:ring-offset-2"
            }`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-4">
          <Link
            to="/seller/register"
            className="text-[#f53d2d] hover:text-[#e63946] font-medium"
          >
            Chưa có tài khoản? Đăng ký bán hàng
          </Link>
          
          <div className="border-t pt-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center gap-2"
            >
              <FaStore />
              Đăng nhập khách hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
