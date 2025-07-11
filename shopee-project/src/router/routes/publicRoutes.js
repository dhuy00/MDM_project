import Login from "../../pages/auth/Login"
import Register from "../../pages/auth/Register"
import { Navigate } from "react-router-dom"

const publicRoutes = [
  { path: '/', 
    element: <Navigate to="/login" replace /> },
  {
    path: '/login',
    element: <Login />,
    role: "customer"
  },
  {
    path: '/register',
    element: <Register />,
    role: "customer"
  },
]

export default publicRoutes