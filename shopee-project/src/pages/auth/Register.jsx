import React from 'react'
import shopeeLogo from '../../assets/ShopeeLogo.png'
import { SiShopee } from "react-icons/si";

const Register = () => {
  return (
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
        {/* Login Form */}
        <form className='flex flex-col bg-white h-fit rounded-md py-8 px-8 gap-4'>
          <h3 className='text-[1.5rem]'>Đăng nhập</h3>
          <input
            type='text'
            placeholder='Số điện thoại/email'
            className='border py-2 px-2 w-[26rem] border-gray-400 
          focus:outline-none' />
          <input
            type='password'
            placeholder='Mật khẩu'
            className='border py-2 px-2 w-[26rem] border-gray-400 
          focus:outline-none' />
          <input
            type='password'
            placeholder='Nhập lại mật khẩu'
            className='border py-2 px-2 w-[26rem] border-gray-400 
          focus:outline-none' />
          <button className='bg-main-orange hover:bg-orange-hover text-white font-medium py-3'>
            ĐĂNG KÝ
          </button>
          <a href='#' className='text-blue-800'>Quên mật khẩu?</a>
          <span className='text-center text-gray-500 '>
            Bạn đã có tài khoản? <a href='/login' className='text-main-orange font-medium'>
              Đăng nhập
            </a>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Register
