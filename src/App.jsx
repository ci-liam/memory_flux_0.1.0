import React, { useEffect, useRef } from "react";
import { MemoryFluxApp } from "./MemoryFluxApp.jsx";

const App = () => {
  const appInitialized = useRef(false);

  useEffect(() => {
    if (!appInitialized.current) {
      appInitialized.current = true;
      const app = new MemoryFluxApp();
      app.init();
    }
  }, []);

  return (
    <div
      id="memory-flux-container"
      style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}
    />
  );
};

export default App;
