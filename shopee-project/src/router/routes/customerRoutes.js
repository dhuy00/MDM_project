import Home from "../../pages/customer/Home";
import OrderHistory from "../../pages/customer/OrderHistory";
import OrderDetail from "../../pages/customer/OrderDetail";
import Product from "./../../pages/product/Product";
import CartPage from "../../pages/cart/CartPage";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import ProtectedRoute from "../ProtectedRoute";

const customerRoutes = [
  {
    path: "/",
    element: <Home />,
    role: "public",
  },
  {
    path: "/product/:id",
    element: <Product />,
    role: "public",
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/orders/:id",
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/login",
    element: <Login />,
    role: "public",
  },
  {
    path: "/register",
    element: <Register />,
    role: "public",
  },
];

export default customerRoutes;
