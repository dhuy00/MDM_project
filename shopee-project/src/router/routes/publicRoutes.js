import Login from "../../pages/auth/Login"
import Register from "../../pages/auth/Register"

const publicRoutes = [
  {
    path: '/login',
    element: <Login/>,
    role: "customer"
  },
  {
    path: '/register',
    element: <Register/>,
    role: "customer"
  },
]

export default publicRoutes