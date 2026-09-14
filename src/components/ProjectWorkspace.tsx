import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "./ProjectWorkspace.css";

const WorkspaceScene = lazy(() => import("./WorkspaceScene"));
const projects = [
  { name: "SATX INK", image: "satx", kind: "Marketing website & studio platform", description: "A product website connected to a studio system for artist profiles, flash collections, booking requests, appointment offers, and deposits.", url: "https://www.satxink.com/" },
  { name: "Rancho de Paloma Blanca", image: "rancho", kind: "Ranch website & online booking", description: "A website rooted in the ranch’s South Texas character, bringing the hunting experience, seasonal information, and online hunt reservations together.", url: "https://www.ranchodepalomablanca.com/" },
  { name: "RoofZeus", image: "roofzeus", kind: "Lead generation & partner integrations", description: "A landing page built to capture roofing leads, document consent with TrustedForm certificates, and deliver leads to buying partners like Modernize.", url: "https://roofzeus.com/" },
];
class WorkspaceBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function ProjectWorkspace() {
  const root = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
  useEffect(() => {
    const size = matchMedia("(min-width: 1024px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setDesktop(size.matches); setReduced(motion.matches); };
    update(); size.addEventListener("change", update); motion.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    if (root.current) observer.observe(root.current);
    const visibility = () => setForeground(document.visibilityState === "visible");
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { size.removeEventListener("change", update); motion.removeEventListener("change", update); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => { if (desktop && visible) setLoaded(true); }, [desktop, visible]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const select = useCallback((index: number) => { setSelected(index); setFocus(index); }, []);
  return <div className="project-workspace" ref={root}>
    <noscript><style>{".project-workspace{display:none!important}.projects-standard{display:block!important}"}</style></noscript>
    <div className="workspace-stage" data-ready={ready && !failed && desktop}>
      <div className="workspace-fallback" aria-hidden="true">{projects.map(project => <img key={project.image} src={`/workspace/${project.image}.webp`} alt="" loading="lazy" />)}</div>
      {desktop && loaded && !failed && <WorkspaceBoundary onFailure={onFailure}><Suspense fallback={null}><WorkspaceScene active={visible && foreground} reduced={reduced} focus={focus} selected={selected} onSelect={select} onReady={onReady} onFailure={onFailure} /></Suspense></WorkspaceBoundary>}
      <div className="workspace-instructions"><span>{ready ? "Choose a screen or a project below." : "Explore the projects below."}</span>{focus !== null && ready && <button onClick={() => setFocus(null)}>View full workspace ↗</button>}</div>
    </div>
    <div className="workspace-choices" role="group" aria-label="Choose a project">{projects.map((project, index) => <button key={project.name} aria-pressed={selected === index} onClick={() => select(index)}><span>0{index + 1}</span>{project.name}<span aria-hidden="true">↗</span></button>)}</div>
    {projects.map((project, index) => <div key={project.name} className="workspace-detail" hidden={selected !== index}>
      <div><p className="portfolio-project-type">{project.kind}</p><h3>{project.name}</h3></div>
      <div><p className="portfolio-description">{project.description}</p><div className="workspace-links">
        <a className="portfolio-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website ↗<span className="sr-only"> (opens in a new tab)</span></a>
        {index === 0 && <><Link className="portfolio-link" to="/work/satx-ink">Read case study ↗</Link><a className="portfolio-link" href="https://demo.satxink.com/" target="_blank" rel="noopener noreferrer">Sweet Venom system demo ↗<span className="sr-only"> (opens in a new tab)</span></a></>}
      </div></div>
    </div>)}
  </div>;
}
