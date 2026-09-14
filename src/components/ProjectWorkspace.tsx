import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "./ProjectWorkspace.css";

const WorkspaceScene = lazy(() => import("./WorkspaceScene"));
const projects = [
  { name: "SATX INK", image: "satx", logo: "satxink.svg", kind: "Marketing website & studio platform", description: "A product website connected to a studio system for artist profiles, flash collections, booking requests, appointment offers, and deposits.", url: "https://www.satxink.com/" },
  { name: "Rancho de Paloma Blanca", image: "rancho", logo: "rancho-de-paloma-blanca.webp", kind: "Ranch website & online booking", description: "A website rooted in the ranch’s South Texas character, bringing the hunting experience, seasonal information, and online hunt reservations together.", url: "https://www.ranchodepalomablanca.com/" },
  { name: "RoofZeus", image: "roofzeus", logo: "roofzeus.webp", kind: "Lead generation & partner integrations", description: "A landing page built to capture roofing leads, document consent with TrustedForm certificates, and deliver leads to buying partners like Modernize.", url: "https://roofzeus.com/" },
];
class WorkspaceBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function ProjectWorkspace() {
  const introPlayed = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(motion.matches); };
    update(); motion.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .2 });
    const stage = root.current?.querySelector(".workspace-stage");
    if (stage) observer.observe(stage);
    const visibility = () => setForeground(document.visibilityState === "visible");
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { motion.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { if (visible) setLoaded(true); }, [visible]);
  useEffect(() => {
    if (!ready || !visible || !foreground || introPlayed.current) return;
    const timer = window.setTimeout(() => {
      introPlayed.current = true;
      setFocus(0);
    }, reduced ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [ready, visible, foreground, reduced]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const select = useCallback((index: number) => { introPlayed.current = true; setSelected(index); setFocus(index); }, []);
  return <div className="project-workspace" ref={root}>
    <noscript><style>{".project-workspace{display:none!important}.projects-standard{display:block!important}"}</style></noscript>
    <div className="workspace-stage" data-ready={ready && !failed}>
      <div className="workspace-fallback" aria-hidden="true"><img src="/workspace/preview.webp" alt="" loading="lazy" /></div>
      {loaded && !failed && <WorkspaceBoundary onFailure={onFailure}><Suspense fallback={null}><WorkspaceScene active={visible && foreground} reduced={reduced} focus={focus} selected={selected} onSelect={select} onReady={onReady} onFailure={onFailure} /></Suspense></WorkspaceBoundary>}
      <div className="workspace-instructions"><span>{ready ? "Choose a screen or a project below." : "Explore the projects below."}</span>{focus !== null && ready && <button onClick={() => setFocus(null)}>View full workspace ↗</button>}</div>
    </div>
    <div className="workspace-choices" role="group" aria-label="Choose a project">{projects.map((project, index) => <button key={project.name} aria-pressed={selected === index} onClick={() => select(index)}><span>0{index + 1}</span><span className="workspace-choice-name" title={project.name}>{project.name}</span><span aria-hidden="true">↗</span></button>)}</div>
    {projects.map((project, index) => <div key={project.name} className="workspace-detail" hidden={selected !== index}>
      <div><p className="portfolio-project-type">{project.kind}</p><h3 className={`workspace-brand workspace-brand--${project.image}`}><img src={`/portfolio/${project.logo}`} alt={project.name} loading="lazy" /></h3></div>
      <div><p className="portfolio-description">{project.description}</p><div className="workspace-links">
        <a className="portfolio-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website ↗<span className="sr-only"> (opens in a new tab)</span></a>
        {index === 0 && <><Link className="portfolio-link" to="/work/satx-ink">Read case study ↗</Link><a className="portfolio-link" href="https://demo.satxink.com/" target="_blank" rel="noopener noreferrer">Sweet Venom system demo ↗<span className="sr-only"> (opens in a new tab)</span></a></>}
      </div></div>
    </div>)}
  </div>;
}
