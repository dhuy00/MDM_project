import MainLayout from "../../layout/MainLayout.jsx";
import allRoutes from "./allRoutes";
import ProtectedRoute from "./ProtectedRoute";
import React from "react";

const getRoutes = () => {
  return {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: allRoutes,
  };
};

export default getRoutes;
