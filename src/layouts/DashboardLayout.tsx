import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/organizations", label: "Organizations" },
  { to: "/projects", label: "Projects" },
  { to: "/invoices", label: "Invoices" },
];

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-60 bg-white border-r">
        <div className="px-4 py-4 font-semibold text-lg">
          <Link to="/">Devnetiks</Link>
        </div>
        <nav className="px-2 py-2 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${isActive ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
          <div className="text-sm text-gray-500">Admin</div>
          <div className="text-sm">Welcome</div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
