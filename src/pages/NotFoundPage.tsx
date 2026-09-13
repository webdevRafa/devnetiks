import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-white">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-7xl flex-1 px-6 py-20">
        <p className="home-eyebrow">404 / Page not found</p>
        <h1 className="mt-6 text-4xl font-bold">This page isn’t here.</h1>
        <p className="mt-5 max-w-lg text-white/70">The link may have changed. Explore our work or tell us about the website or web app you have in mind.</p>
        <div className="mt-7 flex flex-wrap gap-6">
          <Link to="/" className="home-primary-link">Back to home</Link>
          <Link to="/start" className="home-primary-link">Start a project</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
