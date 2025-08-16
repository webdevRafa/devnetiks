// src/pages/AfterLogin.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AfterLogin: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      if (!loading) nav("/login", { replace: true });
      return;
    }
    // Wait until profile is loaded so we don't misroute
    if (loading || !profile) return;

    const role = String(profile?.role || "");
    nav(role.includes("client") ? "/client" : "/app/projects", {
      replace: true,
    });
  }, [loading, user, profile, nav]);

  return (
    <div className="p-6 text-sm text-gray-500">
      Redirecting you to your dashboard…
    </div>
  );
};

export default AfterLogin;
