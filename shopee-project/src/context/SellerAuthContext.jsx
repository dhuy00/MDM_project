import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const SellerAuthContext = createContext();

export const useSellerAuth = () => {
  return useContext(SellerAuthContext);
};

export const SellerAuthProvider = ({ children }) => {
  const [currentSeller, setCurrentSeller] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("seller_token") || null);
  const [loading, setLoading] = useState(true);

  // Thiết lập header cho axios khi token thay đổi
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("seller_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("seller_token");
    }
  }, [token]);

  // Kiểm tra xem seller đã đăng nhập hay chưa khi load trang
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/seller/auth/check-auth`);
        if (response.data.authenticated) {
          setCurrentSeller(response.data.user);
        } else {
          setToken(null);
          setCurrentSeller(null);
        }
      } catch (error) {
        console.error("Error checking seller auth:", error);
        setToken(null);
        setCurrentSeller(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Đăng nhập seller
  const loginSeller = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/seller/auth/login`, {
        username,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setCurrentSeller(response.data.user);
        return { success: true };
      }

      return { success: false, message: "Đăng nhập thất bại" };
    } catch (error) {
      console.error("Seller login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại",
      };
    }
  };

  // Đăng ký seller
  const registerSeller = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/seller/auth/register`, userData);

      if (response.data.success) {
        return { success: true };
      }

      return { success: false, message: "Đăng ký thất bại" };
    } catch (error) {
      console.error("Seller register error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng ký thất bại",
      };
    }
  };

  // Đăng xuất seller
  const logoutSeller = async () => {
    try {
      await axios.post(`${API_URL}/seller/auth/logout`);
    } catch (error) {
      console.error("Seller logout error:", error);
    }
    
    setToken(null);
    setCurrentSeller(null);
  };

  const value = {
    currentSeller,
    token,
    loginSeller,
    registerSeller,
    logoutSeller,
    loading,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {!loading && children}
    </SellerAuthContext.Provider>
  );
};

export default SellerAuthContext;
