import MainLayout from "../../layout/MainLayout.jsx";
import allRoutes from "./allRoutes";
import React from "react";

const getRoutes = () => {
  return {
    path: "/",
    element: <MainLayout />,
    children: allRoutes,
  };
};

export default getRoutes;
