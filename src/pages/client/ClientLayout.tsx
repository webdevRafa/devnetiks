// src/pages/client/ClientLayout.tsx
import React from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ClientLayout: React.FC = () => {
  const { profile } = useAuth();
  const loc = useLocation();
  const adminish = ["admin", "manager", "staff"].includes(
    String(profile?.role)
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2 text-sm ${
      isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200">
        <div className="px-4 py-4 text-lg font-semibold">Devnetiks</div>
        <nav className="px-2 space-y-1">
          <NavLink to="/client" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/client/organization" className={linkClass}>
            My Organization
          </NavLink>
          {/* add more client links later (Projects, Invoices, Tickets) */}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
          <div>
            <div className="text-xs text-gray-500">Client Portal</div>
            <div className="text-sm font-medium">
              {profile?.displayName || profile?.email || "Welcome"}
            </div>
          </div>
          {adminish && loc.pathname.startsWith("/client") && (
            <Link
              to="/app/projects"
              className="rounded-xl bg-gray-900 text-white text-sm px-3 py-2"
            >
              Go to Admin
            </Link>
          )}
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
