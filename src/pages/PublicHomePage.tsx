import { Link } from "react-router-dom";
import { motion as m, type Variants } from "framer-motion";
import ServicesTicker from "@/components/ServicesTicker";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PortfolioSection from "@/components/PortfolioSection";
import ArrowUpRight from "@/components/ArrowUpRight";
import "./PublicHomePage.css";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const services = [
  {
    title: "Brochure & Marketing Sites",
    subtitle: "Make a lasting first impression.",
    description: "Fast, thoughtful websites that bring your brand to life. From landing pages to a complete business presence, every detail helps people understand what you do and take the next step.",
    paths: ["M3 5h18v14H3z", "M3 9h18M7 7h.01M10 7h.01M7 13h5M7 16h9"],
  },
  {
    title: "Data-Backed Apps",
    subtitle: "Turn a good idea into a useful tool.",
    description: "Custom web apps built around the way your business works. Connect your content, simplify everyday tasks, and give your team and customers an experience that feels natural.",
    paths: ["m12 3 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5M3 16l9 5 9-5"],
  },
  {
    title: "Booking & Payments",
    subtitle: "Make the next step effortless.",
    description: "Let customers book a time, reserve a spot, and pay online. Clear steps and connected workflows make it easier to go from the first visit to a confirmed appointment.",
    paths: ["M4 5h16v16H4zM8 3v4M16 3v4M4 10h16", "m8 15 3 3 5-5"],
  },
];

const steps = [
  { number: "01", title: "Plan", body: "Start with a conversation. We get clear on your goals, your audience, and what success looks like—then shape the scope together." },
  { number: "02", title: "Build", body: "See your idea take shape. We design, develop, and refine the experience with you, keeping the work focused and the feedback flowing." },
  { number: "03", title: "Launch & Support", body: "Go live with confidence. We help you launch, settle in, and keep improving as your business and your customers’ needs grow." },
];

export default function PublicHomePage() {
  return (
    <div className="public-home min-h-screen bg-[var(--color-background)] text-white">
      <div className="home-ambient" aria-hidden="true" />
      <SiteHeader />
      <main id="main-content">
        <m.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="home-hero mx-auto max-w-7xl px-6 pt-10 md:pt-16">
          <m.p variants={fadeUp} className="home-eyebrow mb-5">Design. Develop. Deliver.</m.p>
          <m.h1 variants={fadeUp} className="max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl">
            Modern web apps,{" "}<span className="home-gradient-text">delivered end-to-end</span>.
          </m.h1>
          <m.p variants={fadeUp} className="mt-5 max-w-2xl text-pretty text-white/70 md:text-lg">
            We design and build with React, TypeScript, Tailwind CSS, and Firebase. From sleek brochure sites to data-backed apps to full booking & payment systems—Devnetiks turns ideas into shipped products.
          </m.p>
          <m.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-5">
            <Link to="/start" className="home-primary-link">Get a Quote <span aria-hidden="true"><ArrowUpRight /></span></Link>
            <a href="#portfolio" className="home-text-link">View portfolio <span aria-hidden="true">↓</span></a>
          </m.div>
          <m.div variants={fadeUp} className="mt-8"><ServicesTicker maxWidthPx={580} /></m.div>
        </m.section>

        <section className="home-services mx-auto max-w-7xl px-6" aria-labelledby="services-heading">
          <div className="home-section-intro">
            <p className="home-eyebrow">What we build</p>
            <h2 id="services-heading">Built around your business.</h2>
          </div>
          <m.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="home-services-grid">
            {services.map((service) => (
              <m.article variants={fadeUp} key={service.title} className="home-service">
                <svg className="home-service-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {service.paths.map((d) => <path key={d} d={d} />)}
                </svg>
                <h3>{service.title}</h3>
                <p className="home-service-subtitle">{service.subtitle}</p>
                <p className="home-service-description">{service.description}</p>
              </m.article>
            ))}
          </m.div>
        </section>

        <PortfolioSection />

        <section className="home-process mx-auto max-w-7xl px-6" aria-labelledby="process-heading">
          <div className="home-section-intro">
            <p className="home-eyebrow">How we work</p>
            <h2 id="process-heading">A simple path from idea to launch.</h2>
          </div>
          <ol className="home-process-steps">
            {steps.map((step) => (
              <li key={step.number} className="home-process-step">
                <span className="home-step-number" aria-hidden="true">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <div className="home-next">
            <div><p className="home-eyebrow">Your next chapter</p><h2>Let’s build what’s next.</h2></div>
            <Link to="/start" className="home-primary-link">Tell us about your project <span aria-hidden="true"><ArrowUpRight /></span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
