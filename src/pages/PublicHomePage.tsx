// src/pages/PublicHomePage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion as m, type Variants, type Transition } from "framer-motion";
import ServicesTicker from "@/components/ServicesTicker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const easeOutBezier: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutBezier },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

type CardProps = React.PropsWithChildren<{ title: string; subtitle: string }>;

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => {
  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--x", `${x}%`);
    el.style.setProperty("--y", `${y}%`);
  };

  return (
    <m.div
      variants={fadeUp}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-card)] p-6 transition-colors hover:bg-[var(--color-card-hover)]"
    >
      {/* subtle glow on hover */}
      <div
        className="pointer-events-none absolute -inset-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
        style={{
          background:
            "radial-gradient(1200px circle at var(--x,50%) var(--y,50%), var(--accent-color1), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        <div className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-white/80">
          {children}
        </div>
      </div>
    </m.div>
  );
};

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white">
      {/* decorative gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-16rem] h-[32rem] -z-10"
        style={{
          background:
            "radial-gradient(800px circle at 50% 20%, rgba(47,122,251,0.25), transparent 40%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-16rem] h-[32rem] -z-10"
        style={{
          background:
            "radial-gradient(800px circle at 50% 80%, rgba(47,207,154,0.18), transparent 40%)",
        }}
      />

      <SiteHeader />
      <main id="main-content">

      {/* HERO */}
      <m.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6 pt-10 md:pt-16"
      >
        <m.h1
          variants={fadeUp}
          className="max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl"
        >
          Modern web apps,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--accent-color1), var(--accent-color2))",
            }}
          >
            delivered end-to-end
          </span>
          .
        </m.h1>

        <m.p
          variants={fadeUp}
          className="mt-4 max-w-2xl text-pretty text-white/70 md:text-lg"
        >
          We design and build with React, TypeScript, Tailwind CSS, and
          Firebase. From sleek brochure sites to data-backed apps to full
          booking & payment systems—Devnetiks turns ideas into shipped products.
        </m.p>

        <m.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/start"
            className="rounded-xl bg-[var(--accent-color1)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-color1-hover)]"
          >
            Get a Quote
          </Link>
          <a
            href="mailto:devnetiks@gmail.com"
            className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/5"
          >
            Email us
          </a>
        </m.div>

        <m.div variants={fadeUp} className="mt-6">
          <ServicesTicker />
        </m.div>
      </m.section>

      {/* VALUE / WHAT WE BUILD */}
      <m.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6 py-12 md:py-16"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="Brochure & Marketing Sites"
            subtitle="Fast, elegant, on-brand."
          >
            <p>
              Launch a polished presence with performance and accessibility
              built in. We handle SEO basics, analytics, and deploy to modern
              hosting.
            </p>
            <div className="pt-1 text-sm text-white/60">
              Perfect for promos, product pages, and portfolios.
            </div>
          </Card>

          <Card
            title="Data-Backed Apps"
            subtitle="Useful tools, built around your business."
          >
            <p>
              Bring your ideas to life with interactive tools, useful content,
              and connected experiences. We build around the way your business
              works, with room to grow.
            </p>
            <div className="pt-1 text-sm text-white/60">
              Build once, iterate fast, scale when it clicks.
            </div>
          </Card>

          <Card
            title="Booking & Payments"
            subtitle="From intent to paid—smooth."
          >
            <p>
              Make it easy for customers to book a time, reserve a spot, and
              pay online. Clear steps and thoughtful details keep the experience
              smooth from the first click to confirmation.
            </p>
            <div className="pt-1 text-sm text-white/60">
              Great for appointments, events, and services.
            </div>
          </Card>
        </div>
      </m.section>

      {/* PROCESS */}
      <m.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={stagger}
        className="mx-auto max-w-7xl px-6 pb-10 md:pb-16"
      >
        <m.h2
          variants={fadeUp}
          className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
        >
          A simple path from idea to launch
        </m.h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Plan",
              body: "Clarify goals, users, and scope. Pick the essentials, skip the fluff.",
            },
            {
              step: "02",
              title: "Build",
              body: "Ship a clean React/TS codebase with Tailwind styling and Firebase backend.",
            },
            {
              step: "03",
              title: "Launch & Support",
              body: "Deploy, observe, iterate. Add features when your users ask for them.",
            },
          ].map((s) => (
            <m.div
              key={s.step}
              variants={fadeUp}
              className="rounded-2xl border border-white/10 bg-[var(--color-card)] p-5"
            >
              <div className="text-xs font-semibold text-white/50">
                {s.step}
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {s.title}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/70">
                {s.body}
              </div>
            </m.div>
          ))}
        </div>

        <m.div variants={fadeUp} className="mt-8">
          <Link
            to="/start"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-color2)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--accent-color2-hover)]"
          >
            Start scoping your project
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden
            >
              <path
                d="M5 12h14M13 5l7 7-7 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </m.div>
      </m.section>

      </main>
      <SiteFooter />
    </div>
  );
}
