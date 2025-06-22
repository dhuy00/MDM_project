import Home from "../../pages/customer/Home";
import Product from "./../../pages/product/Product";

const customerRoutes = [
  {
    path: "/",
    element: <Home />,
    role: "customer",
  },
  {
    path: "/product/:id",
    element: <Product />,
    role: "customer",
  },
];

export default customerRoutes;
