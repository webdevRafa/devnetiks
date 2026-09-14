// src/App.tsx
import RouteScroll from "@/components/RouteScroll";
import AppRouter from "@/routes/AppRouter";
import PageMetadata from "@/components/PageMetadata";
import { useLayoutEffect } from "react";

export default function App() {
  useLayoutEffect(() => {
    // Remove the fixed boot indicator only after the styled app has committed.
    // It never occupies document space or waits for nonessential images.
    document.getElementById("app-loading")?.remove();
  }, []);
  return <><PageMetadata /><RouteScroll /><AppRouter /></>;
}
