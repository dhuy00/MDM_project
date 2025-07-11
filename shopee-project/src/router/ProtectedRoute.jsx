import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A wrapper around protected routes that requires authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // If the auth system is still loading, show nothing
  if (loading) {
    return null;
  }

  // If the user is not authenticated, redirect to login
  // and save the current location they were trying to go to
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If they are authenticated, show the route's children
  return children;
};

export default ProtectedRoute;
