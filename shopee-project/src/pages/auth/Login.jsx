import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import shopeeLogo from '../../assets/ShopeeLogo.png';
import { SiShopee } from "react-icons/si";
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        toast.success('Đăng nhập thành công!');
        setTimeout(() => {
          navigate('/');  
        }, 1500);
      } else {
        toast.error(result.message || 'Đăng nhập thất bại.');
        setError(result.message || 'Đăng nhập thất bại.');
      }
    } catch (err) {
      toast.error('Lỗi kết nối đến máy chủ.');
      setError('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      {/* Header */}
      <div className='flex justify-between px-48 py-4 items-center'>
        <div className='flex gap-4 items-end'>
          <img src={shopeeLogo} alt='img-logo' className='w-40 object-cover' />
          <span className='text-[1.75rem] font-normal'>Đăng nhập</span>
        </div>
        <button className='text-main-orange font-medium'>Bạn cần giúp đỡ?</button>
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

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className='flex flex-col bg-white h-fit rounded-md py-8 px-8 gap-8'
        >
          <h3 className='text-[1.5rem]'>Đăng nhập</h3>

          <input
            type='text'
            placeholder='Số điện thoại'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
            required
          />

          <input
            type='password'
            placeholder='Mật khẩu'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border py-2 px-2 w-[26rem] border-gray-400 focus:outline-none'
            required
          />

          {error && (
            <span className='text-red-500 text-sm'>{error}</span>
          )}

          <button
            type='submit'
            disabled={loading}
            className='bg-main-orange text-white font-medium py-3 disabled:opacity-50
            hover:bg-orange-hover'
          >
            {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
          </button>

          <a href='/forgot-password' className='text-blue-800'>Quên mật khẩu?</a>

          <span className='text-center text-gray-500'>
            Bạn mới biết đến Shopee? <Link to='/register' className='text-main-orange font-medium'>
              Đăng ký
            </Link>
          </span>

          <div className='border-t pt-4 mt-4'>
            <span className='text-center text-gray-500 block mb-2'>
              Dành cho người bán
            </span>
            <Link 
              to='/seller/login' 
              className='text-center text-blue-600 hover:text-blue-800 font-medium block'
            >
              Đăng nhập Seller Center
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
