// src/layouts/DashboardLayout.tsx
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const nav = [
  { to: "/app/dashboard", label: "Dashboard" },
  { to: "/app/organizations", label: "Organizations" },
  { to: "/app/projects", label: "Projects" },
  { to: "/app/quotes", label: "Requests" },
  { to: "/app/invoices", label: "Invoices" },
];

function SideNavLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group relative block rounded-2xl px-3 py-2 text-sm transition-colors border",
          isActive
            ? "bg-[var(--color-card-hover)] border-white/20 text-white shadow-sm"
            : "bg-[var(--color-card)] border-white/10 text-white/80 hover:bg-[var(--color-card-hover)] hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-[var(--accent-color1)] opacity-0" />
          )}
          <span className="relative z-10">{label}</span>
          <span
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "radial-gradient(60% 60% at 30% 20%, color-mix(in oklab, var(--accent-color1) 25%, transparent) 0%, transparent 70%)",
            }}
          />
        </>
      )}
    </NavLink>
  );
}

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white">
      {/* Global top navigation (brand, user, etc.) */}
      <Navbar />

      {/* Page shell under the navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Sidebar (desktop) */}
          <aside className="relative hidden md:block w-64 shrink-0">
            <div className="sticky top-16 space-y-4">
              <div className="px-2">
                <Link
                  to="/app/projects"
                  className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:opacity-90"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent-color2)] shadow-[0_0_24px_var(--accent-color2)]" />
                  Devnetiks
                </Link>
              </div>

              <nav className="px-2 pb-2 space-y-2">
                {nav.map((n) => (
                  <SideNavLink key={n.to} to={n.to} label={n.label} />
                ))}
              </nav>

              {/* Tip / helper card */}
              <div className="mx-2 rounded-2xl border border-white/10 bg-[var(--color-card)] p-3 text-xs text-white/70">
                <div className="font-medium text-white mb-1">Pro tip</div>
                <p>
                  Requests from clients appear in{" "}
                  <span className="text-white">Requests</span>. Open an item to
                  review and respond with a quote.
                </p>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {/* Ambient wrapper to keep pages legible on dark bg */}
            <div className="rounded-2xl border border-white/10 bg-[var(--color-card)]/40 p-4 sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Subtle gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% -10%, color-mix(in oklab, var(--accent-color1) 15%, transparent) 0%, transparent 60%), radial-gradient(40% 30% at 100% 0%, color-mix(in oklab, var(--accent-color2) 12%, transparent) 0%, transparent 60%)",
        }}
      />
    </div>
  );
};

export default DashboardLayout;
