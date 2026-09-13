// src/App.tsx
import AppRouter from "@/routes/AppRouter";
import { useLayoutEffect } from "react";

export default function App() {
  useLayoutEffect(() => {
    // Remove the fixed boot indicator only after the styled app has committed.
    // It never occupies document space or waits for nonessential images.
    document.getElementById("app-loading")?.remove();
  }, []);
  return <AppRouter />;
}
