import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Import the router
import AppRouter from "./routes/AppRouter"; // adjust path if no @ alias

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
