import Login from "../../pages/auth/Login"

const publicRoutes = [
  {
    path: '/login',
    element: <Login/>,
    role: "customer"
  },
]

export default publicRoutes