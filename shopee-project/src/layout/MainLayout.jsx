import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";


const MainLayout = () => {
  return (
    <div className='w-full bg-[#f5f5f5]'>
      <Header/>
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
