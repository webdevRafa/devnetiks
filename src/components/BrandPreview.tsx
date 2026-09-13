import type { PointerEvent, ReactNode } from "react";
import ArrowUpRight from "./ArrowUpRight";

function trackGlow(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
  const element = event.currentTarget;
  const bounds = element.getBoundingClientRect();
  const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
  const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
  element.style.setProperty("--glow-x", `${x}%`);
  element.style.setProperty("--glow-y", `${y}%`);
  element.dataset.glowActive = "true";
}

export default function BrandPreview({ className, href, label, children }: {
  className: string;
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}
      className={`brand-preview ${className}`}
      onPointerEnter={trackGlow} onPointerMove={trackGlow}
      onPointerLeave={(event) => { delete event.currentTarget.dataset.glowActive; }}
      onPointerCancel={(event) => { delete event.currentTarget.dataset.glowActive; }}>
      {children}
      <span className="brand-preview-open" aria-hidden="true"><ArrowUpRight /></span>
    </a>
  );
}
