// src/layouts/DashboardLayout.tsx
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const nav = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/organizations", label: "Organizations" },
  { to: "/app/projects", label: "Projects" },
  { to: "/app/invoices", label: "Invoices" },
];

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Global top navigation */}
      <Navbar />

      {/* Page shell under the navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Sidebar (desktop) */}
          <aside className="relative hidden md:block w-64 shrink-0">
            <div className="sticky top-16">
              <div className="px-2 py-4">
                <Link
                  to="/app/projects"
                  className="text-lg font-semibold text-gray-900 hover:opacity-90 dark:text-white"
                >
                  Devnetiks
                </Link>
              </div>
              <nav className="px-2 pb-4 space-y-1">
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    className={({ isActive }) =>
                      [
                        "block rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
                      ].join(" ")
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 py-6">
            {/* The Navbar already serves as the header; remove the old inline header */}
            <div className="min-h-[60vh]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
