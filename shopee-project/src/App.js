import { useEffect, useState } from "react";
import Router from "./router/Router";
import getRoutes from "./router/routes";

function App() {
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const routes = getRoutes();       
    setAllRoutes(routes);  
  }, []);

  if (allRoutes.length === 0) return null; 

  return <Router allRoutes={allRoutes} />;
}

export default App;
