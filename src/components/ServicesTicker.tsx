/**
 * ServicesTicker — infinite, hover-pausable marquee (mirrors BenefitSlider pace ~200s).
 * - Left & right edge fades
 * - Width-capped (default 400px) so only one "set" is visible at a time
 * - Aligned LEFT by default (no mx-auto)
 *
 * Usage:
 *   <ServicesTicker />
 *   <ServicesTicker maxWidthPx={480} items={["Brochure sites","Landing pages", ...]} />
 */
type Props = {
  items?: string[];
  maxWidthPx?: number; // default 400
  speedSeconds?: number; // default 200
  className?: string;
};

const DEFAULT_ITEMS = [
  "Brochure sites",
  "Landing pages",
  "Quote & intake forms",
  "Booking & scheduling",
  "Payments & subscriptions",
  "Client portals",
  "Admin dashboards",
  "E‑sign agreements",
  "Invoices & receipts",
  "File uploads & galleries",
  "Notifications & email",
  "Domains & deployments",
  "Support tickets",
];

export default function ServicesTicker({
  items = DEFAULT_ITEMS,
  maxWidthPx = 400,
  speedSeconds = 200,
  className = "",
}: Props) {
  return (
    <div
      className={`relative block w-full overflow-hidden ${className}`}
      style={{ maxWidth: `${maxWidthPx}px` }}
      role="region"
      aria-label="Devnetiks services marquee"
    >
      <style>{`
        @keyframes services-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .services-track {
          animation: services-scroll ${speedSeconds}s linear infinite;
          will-change: transform;
          display: inline-flex;
        }
        .services-track:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .services-track { animation: none; transform: none; }
        }
      `}</style>

      {/* edge fades (match site background variable for seamless blend) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[var(--color-background)] to-transparent" />

      {/* Duplicate once for seamless wrap. Cap container width so only one set is visible. */}
      <div className="services-track items-center gap-2 pr-2">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="shrink-0 rounded-md border border-white/10 bg-[var(--color-card)] px-3 py-1 text-xs text-white/80 min-w-[140px] text-center"
            aria-hidden={i >= items.length}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
