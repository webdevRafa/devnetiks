import { Link, useLocation } from "react-router-dom";

export default function SiteHeader() {
  const { pathname } = useLocation();
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-6 sm:px-6">
      <Link to="/" aria-label="Devnetiks home" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight text-white hover:opacity-90">
        <img src="/devnetiks-emblem.png" width="44" height="44" alt="" className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
        <span className="text-xl sm:text-2xl">Devnetiks</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link to={pathname === "/start" ? "/" : "/start"} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--accent-color1)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-color1-hover)] sm:px-4">
          {pathname === "/start" ? "Back to home" : "Start a Project"}
        </Link>
      </nav>
    </header>
  );
}
