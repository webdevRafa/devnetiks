import { useEffect, useRef, useState, type FormEvent } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function StartProjectPage() {
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    // Restore the form when returning from the provider through browser history.
    const reset = () => { submitting.current = false; setBusy(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    if (submitting.current) { event.preventDefault(); return; }
    for (const field of Array.from(event.currentTarget.elements)) {
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        if (field.required && !field.value.trim()) {
          event.preventDefault();
          field.setCustomValidity("Please fill out this field.");
          field.reportValidity();
          return;
        }
      }
    }
    submitting.current = true;
    setBusy(true);
    // Native POST keeps the provider's CAPTCHA and delivery errors visible.
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-white">
      <SiteHeader />
      <main id="main-content" className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:gap-12 md:pt-16">
        <section>
          <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--accent-color2)]">LET’S BUILD SOMETHING</p>
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">Start a project</h1>
          <p className="mt-4 max-w-xl text-white/70 md:text-lg">Have an idea, a website that needs a refresh, or a question? Tell us a little about it. We’ll reply by email to talk through the next steps.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[var(--color-card)] p-6">
            <h2 className="font-semibold">A simple way to get started</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-white/70">
              <li>Share what you have in mind.</li>
              <li>We’ll discuss the scope, timeline, and budget.</li>
              <li>Build a clear plan for your launch.</li>
            </ol>
          </div>
          <p className="mt-7 text-sm text-white/60">Prefer email? Reach us directly at</p>
          <a href="mailto:devnetiks@gmail.com" className="mt-2 inline-block text-lg text-[var(--accent-color2)] underline underline-offset-4 hover:text-white">devnetiks@gmail.com</a>
        </section>
        <section aria-labelledby="contact-heading" className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 md:p-7">
          <h2 id="contact-heading" className="text-xl font-semibold">Tell us about your project</h2>
          <p className="mt-2 text-sm text-white/60">Just the basics. Fields marked * are required.</p>
          <form action="https://formsubmit.co/devnetiks@gmail.com" method="POST" onSubmit={submit} onInput={(event) => {
            const field = event.target;
            if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
          }} className="mt-6 grid gap-5" aria-busy={busy}>
            <input type="hidden" name="_subject" value="New Devnetiks website inquiry" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value={`${window.location.origin}/thank-you`} />
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium" htmlFor="name">Your name *
                <input id="name" name="name" autoComplete="name" required maxLength={120} className="contact-input" placeholder="Your name" />
              </label>
              <label className="text-sm font-medium" htmlFor="email">Email address *
                <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} className="contact-input" placeholder="you@example.com" />
              </label>
            </div>
            <label className="text-sm font-medium" htmlFor="company">Company <span className="font-normal text-white/50">(optional)</span>
              <input id="company" name="company" autoComplete="organization" maxLength={160} className="contact-input" placeholder="Your company or brand" />
            </label>
            <label className="text-sm font-medium" htmlFor="message">What can we help with? *
              <textarea id="message" name="message" required maxLength={5000} rows={6} className="contact-input resize-y" placeholder="Tell us about your goals, what you need, and any timing you have in mind." />
            </label>
            <p id="form-note" className="text-xs leading-relaxed text-white/60">Your details are sent through FormSubmit to Devnetiks LLC so we can respond to your inquiry. A quick spam check may appear after you continue.</p>
            <button type="submit" disabled={busy} aria-describedby="form-note" className="min-h-12 rounded-xl bg-[var(--accent-color1)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-color1-hover)] disabled:cursor-wait disabled:opacity-60">{busy ? "Continuing…" : "Send message"}</button>
            <p role="status" className="text-center text-xs text-white/60">{busy ? "Opening the form submission page. If it doesn’t open, email us directly." : "We’ll reply to the email address you provide."}</p>
          </form>
        </section>
      </main>
      <div className="mt-auto"><SiteFooter /></div>
    </div>
  );
}
