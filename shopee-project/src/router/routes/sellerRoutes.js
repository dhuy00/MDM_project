import { lazy } from "react";
import ProtectedRoute from "../ProtectedRoute";

const SellerLogin = lazy(() => import("../../pages/seller/SellerLogin"));
const SellerRegister = lazy(() => import("../../pages/seller/SellerRegister"));
const SellerDashboard = lazy(() => import("../../pages/seller/SellerDashboard"));
const SellerProducts = lazy(() => import("../../pages/seller/SellerProducts"));
const AddProduct = lazy(() => import("../../pages/seller/AddProduct"));

const sellerRoutes = [
  {
    path: "/seller/login",
    element: <SellerLogin />,
  },
  {
    path: "/seller/register",
    element: <SellerRegister />,
  },
  {
    path: "/seller/dashboard",
    element: (
      <ProtectedRoute isSeller={true}>
        <SellerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/seller/products",
    element: (
      <ProtectedRoute isSeller={true}>
        <SellerProducts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/seller/products/add",
    element: (
      <ProtectedRoute isSeller={true}>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
];

export default sellerRoutes;
