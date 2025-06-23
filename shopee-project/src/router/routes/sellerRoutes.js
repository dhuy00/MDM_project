import AllProducts from "../../pages/seller/AllProducts";
import PostProductForm from "../../pages/seller/PostProductForm";

const sellerRoutes = [
  {
    path: "/seller/products",
    element: <AllProducts />,
  },
  {
    path: "seller/post-product",
    element: <PostProductForm />
  }
];

export default sellerRoutes;
