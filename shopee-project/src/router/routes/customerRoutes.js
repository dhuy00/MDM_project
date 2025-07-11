import Home from "../../pages/customer/Home";
import OrderHistory from "../../pages/customer/OrderHistory";
import OrderDetail from "../../pages/customer/OrderDetail";
import Product from "./../../pages/product/Product";
import CartPage from "../../pages/cart/CartPage";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import ProtectedRoute from "../ProtectedRoute";
import Cart from "../../pages/customer/Cart";
import Order from "../../pages/customer/Order";
import Review from "../../pages/customer/Review";

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
  {
    path: "/cart-simple",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/order-simple",
    element: (
      <ProtectedRoute>
        <Order />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/order-simple/:id",
    element: (
      <ProtectedRoute>
        <OrderDetail />
      </ProtectedRoute>
    ),
    role: "protected",
  },
  {
    path: "/review",
    element: (
      <ProtectedRoute>
        <Review />
      </ProtectedRoute>
    ),
    role: "protected",
  },
];

export default customerRoutes;
