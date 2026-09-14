import { Link } from "react-router-dom";
export default function SiteFooter() {
  return (
    <footer className="relative mx-auto w-full max-w-7xl px-6 pb-10 text-sm text-white/60">
      <nav aria-label="Explore Devnetiks" className="mb-8 flex flex-wrap gap-x-7 gap-y-4 text-sm">
        <Link to="/web-design-san-antonio" className="hover:text-white">San Antonio website design</Link>
        <Link to="/custom-web-app-development" className="hover:text-white">Custom web applications</Link>
        <Link to="/work/satx-ink" className="hover:text-white">SATX INK case study</Link>
        <Link to="/work/rogers-roofing" className="hover:text-white">Roger’s Roofing case study</Link>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
        <div>
          <p>© {new Date().getFullYear()} Devnetiks LLC. All rights reserved.</p>
          <p className="mt-1 text-xs">Devnetiks is owned and operated by Devnetiks LLC.</p>
        </div>
        <a href="mailto:devnetiks@gmail.com" className="py-2 text-white/80 underline decoration-white/25 underline-offset-4 hover:text-white">devnetiks@gmail.com</a>
      </div>
    </footer>
  );
}
