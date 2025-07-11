import { useEffect, useState } from "react";
import Router from "./router/Router";
import getRoutes from "./router/routes";
import { AuthProvider } from "./context/AuthContext";
import publicRoutes from "./router/routes/publicRoutes";


function App() {
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes([routes]);
  }, []);

  return (
    <AuthProvider>
      <Router allRoutes={allRoutes} />
    </AuthProvider>
  );
}

export default App;
