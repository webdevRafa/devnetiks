import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/devlogo.svg";

export default function ClientLayout() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[var(--color-card)]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <img className="w-[80px]" src={logo} alt="" />
          </div>
          <div className="text-sm uppercase tracking-widest text-white/70">
            Client Portal
          </div>
          <div className="text-sm text-white/60">
            {profile?.displayName ? `Hi, ${profile.displayName}` : "Welcome"}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-white/10 bg-[var(--color-card)] p-1">
          <Tab to="/client" label="Home" />
          <Tab to="/client/organization" label="Organization" />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

function Tab({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "px-4 py-2 rounded-xl text-sm transition " +
        (isActive
          ? "bg-[var(--accent-color1)]"
          : "hover:bg-[var(--color-card-hover)] text-white/80")
      }
      end
    >
      {label}
    </NavLink>
  );
}
