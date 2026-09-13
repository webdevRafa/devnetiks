import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-white">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-2xl flex-1 items-center px-6 py-20">
        <section className="w-full rounded-2xl border border-white/10 bg-[var(--color-card)] p-8 text-center sm:p-12">
          <img src="/devnetiks-emblem.png" width="72" height="72" alt="" className="mx-auto mb-6 rounded-full" />
          <h1 className="text-3xl font-bold sm:text-4xl">Thanks for reaching out.</h1>
          <p className="mt-4 leading-relaxed text-white/70">Once your submission is complete, we’ll follow up at the email address you provided to discuss your project.</p>
          <p className="mt-4 text-sm text-white/60">Anything to add? Email <a href="mailto:devnetiks@gmail.com" className="text-[var(--accent-color2)] underline underline-offset-4">devnetiks@gmail.com</a>.</p>
          <Link to="/" className="mt-8 inline-flex rounded-xl bg-[var(--accent-color1)] px-5 py-3 text-sm font-semibold hover:bg-[var(--accent-color1-hover)]">Back to home</Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
