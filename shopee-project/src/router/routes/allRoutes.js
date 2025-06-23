import customerRoutes from "./customerRoutes"
import sellerRoutes from "./sellerRoutes";

const allRoutes = [
  ...customerRoutes,
  ...sellerRoutes,
]

export default allRoutes