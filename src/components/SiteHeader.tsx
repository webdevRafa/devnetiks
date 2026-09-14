import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SiteHeader.css";

export default function SiteHeader() {
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let distance = 0;
    let frame = 0;
    setHidden(false);
    setScrolled(previousY > 32);

    const update = () => {
      frame = 0;
      // Clamp elastic overscroll so bouncing at either end cannot reverse intent.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(maxY, Math.max(0, window.scrollY));
      const delta = y - previousY;
      previousY = y;
      setScrolled(y > 32);
      if (y <= 32 || headerRef.current?.contains(document.activeElement)) {
        distance = 0;
        setHidden(false);
        return;
      }
      if (!delta) return;
      distance = Math.sign(delta) === Math.sign(distance) ? distance + delta : delta;
      if (distance > 24 && y > 96) {
        setHidden(true);
        distance = 0;
      } else if (distance < -12) {
        setHidden(false);
        distance = 0;
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header ref={headerRef} className="site-header" data-hidden={hidden} data-scrolled={scrolled} onFocusCapture={() => setHidden(false)}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-5 py-6 sm:px-6">
      <Link to="/" aria-label="Devnetiks home" className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight text-white hover:opacity-90">
        <img src="/devnetiks-emblem.png" width="44" height="44" fetchPriority="high" alt="" className="h-10 w-10 rounded-full sm:h-11 sm:w-11" />
        <span className="text-xl sm:text-2xl">Devnetiks</span>
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-5">
        <a href="/#portfolio" className="hidden min-h-11 items-center text-sm font-medium text-white/75 hover:text-white sm:inline-flex">Portfolio</a>
        <Link to={pathname === "/start" ? "/" : "/start"} className="site-header-action inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold sm:px-4">
          {pathname === "/start" ? "Back to home" : "Share Your Idea"}
        </Link>
      </nav>
      </div>
    </header>
  );
}
