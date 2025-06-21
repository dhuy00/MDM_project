import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'


const MainLayout = () => {
  
  return (
    <div className='w-full h-screen'>
      <Header/>
      <div>
        <Outlet />
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout
