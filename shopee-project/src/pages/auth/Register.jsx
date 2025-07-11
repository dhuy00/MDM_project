// <<<<<<< khoi_fe_home_page_product_page
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { FaUser, FaLock, FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     phone: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.id]: e.target.value,
//     });
//   };
// =======
import React, { useState } from 'react'
import shopeeLogo from '../../assets/ShopeeLogo.png'
import { SiShopee } from "react-icons/si";
import { toast } from 'react-toastify';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

// <<<<<<< khoi_fe_home_page_product_page
//     const { username, email, password, confirmPassword, phone } = formData;

//     // Kiểm tra nhập liệu
//     if (!username || !email || !password || !confirmPassword) {
//       setError("Vui lòng điền đầy đủ thông tin");
// =======
    if (!fullName || !phone || !password || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
// <<<<<<< khoi_fe_home_page_product_page
//       setError("Mật khẩu và xác nhận mật khẩu không khớp");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const result = await register({
//         username,
//         email,
//         password,
//         phone,
//       });

//       if (result.success) {
//         // Chuyển hướng đến trang đăng nhập
//         navigate("/login", { state: { registered: true } });
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
//       setError(errorMessage);
//       console.error("Register error:", error);
//       console.error("Error details:", error.response?.data);
//     } finally {
//       setLoading(false);
// =======
      toast.error('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: phone,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Đăng ký thất bại!');
      }

      toast.success('Đăng ký thành công!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  };

//   return (
// <<<<<<< khoi_fe_home_page_product_page
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-[#f53d2d]">Đăng ký</h2>
//           <p className="text-gray-500 mt-2">
//             Tạo tài khoản để mua sắm trên Shopee
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="username">
//               Tên đăng nhập *
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-3 text-gray-400">
//                 <FaUser />
//               </span>
//               <input
//                 id="username"
//                 type="text"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f53d2d]"
//                 placeholder="Tên đăng nhập"
//                 value={formData.username}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="email">
//               Email *
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-3 text-gray-400">
//                 <FaEnvelope />
//               </span>
//               <input
//                 id="email"
//                 type="email"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f53d2d]"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-gray-700 mb-2" htmlFor="password">
//               Mật khẩu *
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-3 text-gray-400">
//                 <FaLock />
//               </span>
//               <input
//                 id="password"
//                 type="password"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f53d2d]"
//                 placeholder="Mật khẩu"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label
//               className="block text-gray-700 mb-2"
//               htmlFor="confirmPassword"
//             >
//               Xác nhận mật khẩu *
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-3 text-gray-400">
//                 <FaLock />
//               </span>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f53d2d]"
//                 placeholder="Xác nhận mật khẩu"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 mb-2" htmlFor="phone">
//               Số điện thoại
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-3 text-gray-400">
//                 <FaPhone />
//               </span>
//               <input
//                 id="phone"
//                 type="tel"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f53d2d]"
//                 placeholder="Số điện thoại"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#f53d2d] text-white py-2 px-4 rounded hover:bg-[#f53d2d]/90 focus:outline-none"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <FaSpinner className="animate-spin mr-2" />
//                 Đang xử lý...
//               </span>
//             ) : (
//               "Đăng ký"
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p>
//             Đã có tài khoản?{" "}
//             <Link to="/login" className="text-[#f53d2d] hover:underline">
//               Đăng nhập
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

    <div className='w-full h-screen flex flex-col'>
      {/* Header */}
      <div className='flex justify-between px-48 py-4 items-center'>
        <div className='flex gap-4 items-end'>
          <img src={shopeeLogo} alt='img-logo' className='w-40 object-cover' />
          <span className='text-[1.75rem] font-normal'>Đăng ký</span>
        </div>
        <a href='#' className='text-main-orange font-medium'>Bạn cần giúp đỡ?</a>
      </div>

      {/* Body */}
      <div className='flex-1 bg-main-orange flex gap-12 items-center justify-center'>
        <div className='w-1/2 flex flex-col justify-center items-center h-full text-white gap-12'>
          <div className='flex flex-col justify-center items-center w-fit'>
            <SiShopee className='w-48 h-48 text-white' />
            <span className='text-[3rem] font-medium'>Shopee</span>
          </div>
          <span className='block max-w-[370px] font-medium text-[1.5rem] text-center'>
            Nền tảng thương mại điện tử yêu thích ở Đông Nam Á và Đài Loan
          </span>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className='flex flex-col bg-white h-fit rounded-md py-8 px-8 gap-4'>
          <h3 className='text-[1.5rem]'>Đăng ký</h3>

          <input
            type='text'
            placeholder='Họ tên'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
          />

          <input
            type='text'
            placeholder='Số điện thoại'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
          />

          <input
            type='password'
            placeholder='Mật khẩu'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
          />

          <input
            type='password'
            placeholder='Nhập lại mật khẩu'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
          />

          <button type='submit' className='bg-main-orange hover:bg-orange-hover text-white font-medium py-3'>
            ĐĂNG KÝ
          </button>

          <a href='#' className='text-blue-800'>Quên mật khẩu?</a>

          <span className='text-center text-gray-500'>
            Bạn đã có tài khoản? <a href='/login' className='text-main-orange font-medium'>
              Đăng nhập
            </a>
          </span>
        </form>
      </div>
    </div>
}

export default Register
