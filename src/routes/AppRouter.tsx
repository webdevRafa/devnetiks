import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PublicHomePage from "@/pages/PublicHomePage";
import StartProjectPage from "@/pages/StartProjectPage";
import ThankYouPage from "@/pages/ThankYouPage";

const router = createBrowserRouter([
  { path: "/", element: <PublicHomePage /> },
  { path: "/start", element: <StartProjectPage /> },
  { path: "/contact", element: <Navigate to="/start" replace /> },
  { path: "/thank-you", element: <ThankYouPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
