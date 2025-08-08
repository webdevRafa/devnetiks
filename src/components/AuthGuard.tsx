import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // adjust if different
import type { Role } from "@/types/types";

interface Props {
  children: React.ReactNode;
  requireRole?: Role[]; // <- uses the same Role as profile.role
}

const AuthGuard: React.FC<Props> = ({ children, requireRole }) => {
  const { user, profile, loading } = useAuth(); // profile should include role

  if (loading)
    return <div className="p-6 text-sm text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (requireRole && profile?.role && !requireRole.includes(profile.role)) {
    return (
      <div className="p-6 text-red-600 text-sm">
        You do not have access to this area.
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
