import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSellerAuth } from "../context/SellerAuthContext";

// A wrapper around protected routes that requires authentication
const ProtectedRoute = ({ children, isSeller = false }) => {
  const { currentUser, loading } = useAuth();
  const { currentSeller, loading: sellerLoading } = useSellerAuth();
  const location = useLocation();

  // If the auth system is still loading, show nothing
  if (isSeller ? sellerLoading : loading) {
    return null;
  }

  // If it's a seller route and seller is not authenticated, redirect to seller login
  if (isSeller && !currentSeller) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  // If it's a customer route and user is not authenticated, redirect to customer login
  if (!isSeller && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are authenticated, show the route's children
  return children;
};

export default ProtectedRoute;
