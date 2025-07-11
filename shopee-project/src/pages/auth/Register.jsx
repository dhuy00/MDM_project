import React, { useState } from "react";
import shopeeLogo from "../../assets/ShopeeLogo.png";
import { SiShopee } from "react-icons/si";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !phone || !password || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    try {
      const result = await register({
        full_name: fullName,
        phone: phone,
        password: password,
      });

      if (result.success) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        toast.error(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between px-48 py-4 items-center">
        <div className="flex gap-4 items-end">
          <img src={shopeeLogo} alt="img-logo" className="w-40 object-cover" />
          <span className="text-[1.75rem] font-normal">Đăng ký</span>
        </div>
        <button className="text-main-orange font-medium">
          Bạn cần giúp đỡ?
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 bg-main-orange flex gap-12 items-center justify-center">
        <div className="w-1/2 flex flex-col justify-center items-center h-full text-white gap-12">
          <div className="flex flex-col justify-center items-center w-fit">
            <SiShopee className="w-48 h-48 text-white" />
            <span className="text-[3rem] font-medium">Shopee</span>
          </div>
          <span className="block max-w-[370px] font-medium text-[1.5rem] text-center">
            Nền tảng thương mại điện tử yêu thích ở Đông Nam Á và Đài Loan
          </span>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white h-fit rounded-md py-8 px-8 gap-4"
        >
          <h3 className="text-[1.5rem]">Đăng ký</h3>

          <input
            type="text"
            placeholder="Họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-main-orange hover:bg-orange-hover text-white font-medium py-3"
          >
            ĐĂNG KÝ
          </button>

          <button type="button" className="text-blue-800">
            Quên mật khẩu?
          </button>

          <span className="text-center text-gray-500">
            Bạn đã có tài khoản?{" "}
            <Link to="/login" className="text-main-orange font-medium">
              Đăng nhập
            </Link>
          </span>
          
          <div className="text-center mt-4">
            <span className="text-gray-500 text-sm">
              Bạn là người bán hàng?{" "}
              <Link to="/seller/register" className="text-main-orange font-medium">
                Đăng ký bán hàng
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
