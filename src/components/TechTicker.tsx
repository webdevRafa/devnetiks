/**
 * TechTicker — seamless, hover-pausable marquee that mirrors BenefitSlider's
 * infinite-scroll pattern + speed (200s). Left/right edge fades, width-capped
 * so it never stretches full-bleed, and no duplicate "sets" visible at once.
 *
 * Aligned LEFT by default (no mx-auto). Drop it anywhere on the page.
 */
const items = ["React", "TypeScript", "Tailwind CSS", "Firebase", "Stripe"];

export default function TechTicker() {
  return (
    <div
      className="relative block w-full max-w-[400px] overflow-hidden"
      role="region"
      aria-label="Tech stack marquee"
    >
      <style>{`
        @keyframes tech-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Match BenefitSlider pace: very slow, seamless loop */
        .tech-track {
          animation: tech-scroll 200s linear infinite;
          will-change: transform;
        }
        .tech-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .tech-track { animation: none; transform: none; }
        }
      `}</style>

      {/* edge fades (use site background var for a clean blend) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[var(--color-background)] to-transparent" />

      {/* duplicate once for a seamless wrap; cap container so only one "set" is visible */}
      <div className="tech-track flex w-max items-center gap-2 pr-2">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="shrink-0 rounded-md border border-white/10 bg-[var(--color-card)] px-3 py-1 text-xs text-white/80 min-w-[120px] text-center"
            aria-hidden={i >= items.length}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
