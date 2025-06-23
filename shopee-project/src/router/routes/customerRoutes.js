import Home from "../../pages/customer/Home"
import Cart from "../../pages/customer/Cart"
import Order from "../../pages/customer/Order"
import Review from "../../pages/customer/Review"
import OrderDetail from "../../pages/customer/OrderDetail"

const customerRoutes = [
  {
    path: '/home',
    element: <Home/>,
    role: "customer"
  },
  {
    path: '/cart',
    element: <Cart/>,
    role: "customer"
  },
  {
    path: '/order',
    element: <Order/>,
    role: "customer"
  },
  {
    path: '/order/:id',
    element: <OrderDetail/>,
    role: "customer"
  },
  {
    path: '/review',
    element: <Review/>,
    role: "customer"
  },
]

export default customerRoutes