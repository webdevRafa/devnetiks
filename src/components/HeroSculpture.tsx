import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./HeroSculpture.css";

const Scene = lazy(() => import("./HeroScene"));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function StillSculpture() {
  return <svg viewBox="0 0 600 600" className="sculpture-still" aria-hidden="true">
    <defs>
      <linearGradient id="core-fill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2c99ef" /><stop offset="1" stopColor="#052b37" /></linearGradient>
      <linearGradient id="orbit-line"><stop stopColor="#277afd" /><stop offset="1" stopColor="#48f0c8" /></linearGradient>
      <radialGradient id="core-halo"><stop stopColor="#0c9aaf" stopOpacity=".25" /><stop offset="1" stopColor="#0b0d12" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx="300" cy="300" r="260" fill="url(#core-halo)" />
    <g fill="none" stroke="url(#orbit-line)">
      <ellipse cx="300" cy="300" rx="224" ry="87" transform="rotate(-30 300 300)" strokeWidth="2" />
      <ellipse cx="300" cy="300" rx="214" ry="108" transform="rotate(62 300 300)" strokeWidth="1.5" />
      <ellipse cx="300" cy="300" rx="178" ry="178" strokeDasharray="3 12" opacity=".45" />
      <path d="M300 182 407 253 386 376 263 414 184 313 209 227Z M300 182 263 414 M209 227 386 376 M184 313 407 253" opacity=".65" />
    </g>
    <path d="m300 218 72 82-72 93-74-93Z" fill="url(#core-fill)" stroke="#62decf" strokeWidth="1.5" />
    <path d="m300 218-12 94 12 81 72-93Z" fill="#092636" stroke="#369cae" />
    <g fill="#72fce0"><circle cx="110" cy="364" r="5" /><circle cx="392" cy="122" r="4" /><circle cx="483" cy="347" r="3" /></g>
  </svg>;
}

export default function HeroSculpture() {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .05 });
    if (container.current) observer.observe(container.current);
    const visibility = () => setForeground(document.visibilityState === "visible");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { media.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  // Once loaded, retain the scene while offscreen but stop its render loop.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (enabled && visible) setLoaded(true); }, [enabled, visible]);
  const active = enabled && visible && foreground && !paused;
  const live = enabled && loaded && !lost;
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => { setLost(true); setReady(false); }, []);

  useEffect(() => {
    const reset = () => { pointer.current = { x: 0, y: 0 }; };
    if (!active) { reset(); return; }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = {
        x: Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1)),
        y: Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1)),
      };
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [active]);

  return <div ref={container} className="hero-sculpture" data-ready={live && ready}>
    <div className="sculpture-art" aria-hidden="true">
      <StillSculpture />
      {live && <SceneBoundary onFailure={onLost}><Suspense fallback={null}><Scene active={active} pointer={pointer} onReady={onReady} onLost={onLost} /></Suspense></SceneBoundary>}
    </div>
    <div className="sculpture-caption">
      {live && ready && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play hero animation" : "Pause hero animation"}>{paused ? "Play" : "Pause"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}
    </div>
  </div>;
}
