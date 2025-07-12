import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Thiết lập header cho axios khi token thay đổi
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Kiểm tra xem user đã đăng nhập hay chưa khi load trang
  useEffect(() => {
    console.log("AuthContext checkAuth called with token:", !!token); // Debug log
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/check-auth`);
        if (response.data.authenticated) {
          setCurrentUser(response.data.user);
        } else {
          // Clear token without calling logout to avoid infinite loop
          setToken(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        // Clear token without calling logout to avoid infinite loop
        setToken(null);
        setCurrentUser(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Đăng nhập
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        phone: username, // Backend expects 'phone' field
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
        setCurrentUser(response.data.user);
        return { success: true };
      }

      return { success: false, message: "Đăng nhập thất bại" };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại",
      };
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      console.log("Attempting to register with data:", {
        ...userData,
        password: "****",
      });
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log("Registration response:", response.data);

      if (response.data.success) {
        return { success: true };
      }

      return { success: false, message: "Đăng ký thất bại" };
    } catch (error) {
      console.error("Register error:", error);
      console.error("Error response data:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng ký thất bại",
      };
    }
  };

  // Đăng xuất
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
