import { useEffect, useState } from "react";
import Router from "./router/Router";
import getRoutes from "./router/routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [allRoutes, setAllRoutes] = useState([]);

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
