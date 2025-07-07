import { Children } from "react";
import MainLayout from "../../layout/MainLayout.jsx";
import allRoutes from "./allRoutes";
import React from 'react';

const getRoutes = () => {
  // privateRoutes.map(route => {
  // //  console.log(route);
  //    route.element = <ProtectedRoute route={route}>{route.element}</ProtectedRoute>
  // })
  return [{
    path: '/',
    element: <MainLayout />,
    children: allRoutes,
  }];
};

export default getRoutes;