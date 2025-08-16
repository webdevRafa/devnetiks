// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Role =
  | "admin"
  | "manager"
  | "staff"
  | "client"
  | "viewer"
  | "contractor"
  | string;

type NavItem = {
  label: string;
  to: string;
  end?: boolean;
  children?: NavItem[];
};

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const navItemClasses =
  "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors";
const navItemActive =
  "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900";
const navItemIdle =
  "text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800";

// FIX: Accept a ref that may be null in TS, and any HTMLElement subtype.
function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClickOutside, ref]);
}

function Avatar({
  url,
  name,
  size = 36,
}: {
  url?: string | null;
  name?: string | null;
  size?: number;
}) {
  const initials =
    (name || "")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";
  const style = { width: size, height: size };
  if (url) {
    return (
      <img
        src={url}
        alt={name || "User avatar"}
        className="rounded-full object-cover ring-1 ring-black/10 dark:ring-white/10"
        style={style}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gray-200 text-gray-700 grid place-items-center ring-1 ring-black/10 dark:bg-gray-700 dark:text-gray-200"
      style={style}
    >
      <span className="text-xs font-semibold">{initials}</span>
    </div>
  );
}

function useNav(role: Role | undefined, pathname: string, isAuthed: boolean) {
  const inAdmin = pathname.startsWith("/app");
  const inClient = pathname.startsWith("/client");

  const adminNav: NavItem[] = [
    { label: "Projects", to: "/app/projects" },
    { label: "Organizations", to: "/app/organizations" },
    { label: "Invoices", to: "/app/invoices" },
    { label: "Dashboard", to: "/app/dashboard" },
  ];

  const clientNav: NavItem[] = [
    { label: "Overview", to: "/client", end: true },
    { label: "Organization", to: "/client/organization" },
  ];

  const publicNav: NavItem[] = [
    { label: "Start a Project", to: "/start" },
    ...(isAuthed ? [] : [{ label: "Log in", to: "/login" }]),
  ];

  if (inAdmin) return adminNav;
  if (inClient) return clientNav;
  // If user is a client and not in admin, prefer client tabs on public pages.
  if (
    !inAdmin &&
    !inClient &&
    isAuthed &&
    role &&
    String(role).includes("client")
  ) {
    return clientNav;
  }
  return publicNav;
}

const Navbar: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); // FIX: allow null

  useOnClickOutside(menuRef as React.RefObject<HTMLElement | null>, () =>
    setMenuOpen(false)
  );

  useEffect(() => {
    // Close menus on route change
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  const role: Role | undefined = profile?.role || (undefined as any);
  const isAuthed = !!user;

  const navItems = useNav(role, location.pathname, isAuthed);

  const avatarUrl =
    profile?.photoURL ||
    (user as any)?.photoURL ||
    (profile as any)?.avatarUrl ||
    null;

  const displayName =
    profile?.displayName || (user as any)?.displayName || "User";

  const dashboardHref = React.useMemo(() => {
    if (!isAuthed) return "/login";
    // Default admin home is projects; clients go to /client
    if (
      role &&
      String(role).includes("client") &&
      !location.pathname.startsWith("/app")
    ) {
      return "/client";
    }
    return "/app/projects";
  }, [isAuthed, role, location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand + Tabs */}
          <div className="flex items-center gap-4">
            <Link
              to="/app/projects"
              className="font-bold text-lg tracking-tight text-gray-900 hover:opacity-90 dark:text-white"
            >
              Devnetiks
            </Link>

            {/* Desktop tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((n) => {
                if (!n.children?.length) {
                  return (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      end={n.end}
                      className={({ isActive }) =>
                        classNames(
                          navItemClasses,
                          isActive ? navItemActive : navItemIdle
                        )
                      }
                    >
                      {n.label}
                    </NavLink>
                  );
                }
                return (
                  <div key={n.to} className="relative group">
                    <button
                      className={classNames(navItemClasses, navItemIdle)}
                      onClick={(e) => e.preventDefault()}
                    >
                      {n.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-4 w-4 opacity-70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.207l3.71-3.976a.75.75 0 011.1 1.02l-4.25 4.55a.75.75 0 01-1.1 0l-4.25-4.55a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute left-0 mt-2 hidden min-w-[200px] rounded-xl border border-black/5 bg-white p-2 shadow-xl group-hover:block dark:border-white/10 dark:bg-gray-900">
                      {n.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            classNames(
                              "block rounded-lg px-3 py-2 text-sm",
                              isActive
                                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                            )
                          }
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: User */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>

            {/* Avatar / Auth actions */}
            {!loading && isAuthed ? (
              <div className="relative" ref={menuRef}>
                <button
                  className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Avatar url={avatarUrl} name={displayName} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-black/5 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-gray-900">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {displayName}
                      </p>
                      {user?.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
                    <Link
                      to={dashboardHref}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      My Dashboard
                    </Link>
                    {role && String(role).includes("admin") && (
                      <Link
                        to="/app/invoices/new"
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        New Invoice
                      </Link>
                    )}
                    {role && String(role).includes("client") && (
                      <Link
                        to="/client/organization"
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      >
                        My Organization
                      </Link>
                    )}
                    <button
                      onClick={() => signOut?.()}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
              >
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4">
            <div className="grid gap-1">
              {navItems.map((n) =>
                !n.children?.length ? (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={({ isActive }) =>
                      classNames(
                        "rounded-xl px-3 py-2 text-sm",
                        isActive
                          ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                      )
                    }
                  >
                    {n.label}
                  </NavLink>
                ) : (
                  <div
                    key={n.to}
                    className="rounded-xl bg-gray-50 p-2 dark:bg-gray-900/50"
                  >
                    <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {n.label}
                    </div>
                    <div className="grid gap-1">
                      {n.children.map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            classNames(
                              "rounded-lg px-3 py-2 text-sm",
                              isActive
                                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                            )
                          }
                        >
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )
              )}
              {!loading && !isAuthed && (
                <Link
                  to="/login"
                  className="rounded-xl bg-gray-900 px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-gray-900"
                >
                  Log in
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
