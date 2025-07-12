import { useEffect, useState } from "react";
import Router from "./router/Router";
import getRoutes from "./router/routes";

function App() {
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes([routes]);
  }, []);

  return <Router allRoutes={allRoutes} />;
}

export default App;
