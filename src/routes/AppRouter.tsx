import { Routes, Route, Navigate } from "react-router-dom";
import PublicHomePage from "@/pages/PublicHomePage";
import StartProjectPage from "@/pages/StartProjectPage";
import ThankYouPage from "@/pages/ThankYouPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<PublicHomePage />} />
    <Route path="/start" element={<StartProjectPage />} />
    <Route path="/contact" element={<Navigate to="/start" replace />} />
    <Route path="/thank-you" element={<ThankYouPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>;
}
