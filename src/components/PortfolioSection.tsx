import { useEffect, useRef, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandPreview from "./BrandPreview";
import ArrowUpRight from "./ArrowUpRight";
import "./PortfolioSection.css";

const projects = [
  {
    name: "RoofZeus",
    category: "Roofing estimate platform",
    description:
      "A guided experience that helps homeowners explore roofing estimates, starting with their ZIP code and moving through a clear, step-by-step request.",
    capabilities: ["Guided estimate flow", "Homeowner inquiries"],
    url: "https://roofzeus.com/",
    domain: "roofzeus.com",
    logo: "/portfolio/roofzeus.webp",
    width: 1420,
    height: 476,
    theme: "roofzeus",
  },
  {
    name: "Rancho de Paloma Blanca",
    category: "Ranch website & online booking",
    description:
      "A website rooted in the ranch’s South Texas character, bringing the hunting experience, seasonal information, and online hunt reservations together.",
    capabilities: ["Ranch storytelling", "Hunt reservations"],
    url: "https://www.ranchodepalomablanca.com/",
    domain: "ranchodepalomablanca.com",
    logo: "/portfolio/rancho-de-paloma-blanca.webp",
    width: 1024,
    height: 1024,
    theme: "rancho",
  },
  {
    name: "Roger’s Roofing",
    category: "Contractor website & estimate requests",
    description:
      "A service-focused website for a San Antonio roofing company, with clear service information and a straightforward way for homeowners to request an estimate.",
    capabilities: ["Service showcase", "Estimate requests"],
    url: "https://www.rogersroofingtx.com/",
    domain: "rogersroofingtx.com",
    logo: "/portfolio/rogers-roofing.png",
    width: 1672,
    height: 941,
    theme: "rogers",
    caseStudy: "/work/rogers-roofing",
  },
];

function ProjectLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="portfolio-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}<ArrowUpRight /><span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export default function PortfolioSection() {
  const { hash } = useLocation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The section mounts after the browser's initial fragment navigation in this SPA.
    if (hash === "#portfolio") sectionRef.current?.scrollIntoView({ block: "start" });
  }, [hash]);

  return (
    <section ref={sectionRef} id="portfolio" aria-labelledby="portfolio-heading" className="portfolio-section mx-auto max-w-7xl px-6 pb-16 md:pb-20">
      <div className="portfolio-heading">
        <div>
          <p className="portfolio-eyebrow">Portfolio</p>
          <h2 id="portfolio-heading" className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Built by Devnetiks.</h2>
        </div>
        <p className="max-w-lg text-base leading-relaxed text-white/65">From the first impression to the everyday workflow. A selection of websites and systems we’ve built for real businesses.</p>
      </div>

      <div className="portfolio-feature">
        <BrandPreview className="portfolio-satx-brand" href="https://www.satxink.com/" label="Visit SATX INK marketing website">
          <span className="portfolio-feature-label">Website + business system</span>
          <img src="/portfolio/satxink.svg" width="1170" height="328" alt="SATX INK" loading="lazy" decoding="async" />
          <p>Two connected experiences.<br /><span>One studio software brand.</span></p>
        </BrandPreview>

        <article className="portfolio-feature-project" aria-labelledby="satxink-marketing-heading">
          <p className="portfolio-project-type">01 / The introduction</p>
          <h3 id="satxink-marketing-heading">SATX INK Marketing</h3>
          <p className="portfolio-description">A dedicated marketing website that introduces the SATX INK platform, explains the studio experience, and helps shop owners explore what’s possible.</p>
          <ul className="portfolio-tags" aria-label="SATX INK marketing capabilities">
            <li>Product storytelling</li><li>Demo discovery</li>
          </ul>
          <div className="portfolio-project-action">
            <Link className="portfolio-link mr-5" to="/work/satx-ink">Read case study</Link>
            <ProjectLink href="https://www.satxink.com/">Visit SATX INK</ProjectLink>
            <p className="portfolio-domain">satxink.com</p>
          </div>
        </article>

        <article className="portfolio-feature-project" aria-labelledby="satxink-system-heading">
          <p className="portfolio-project-type">02 / The experience</p>
          <h3 id="satxink-system-heading">SATX INK System</h3>
          <p className="portfolio-description">The companion shop platform: artist profiles, flash collections, booking requests, appointment offers, and deposits, with workspaces for owners, artists, and clients.</p>
          <ul className="portfolio-tags" aria-label="SATX INK system capabilities">
            <li>Flash & booking</li><li>Studio operations</li>
          </ul>
          <div className="portfolio-project-action">
            <ProjectLink href="https://demo.satxink.com/">View system demo</ProjectLink>
            <p className="portfolio-demo-note">
              <img src="/portfolio/sweet-venom-logo.png" width="1983" height="793" alt="Sweet Venom logo" loading="lazy" decoding="async" />
              Demo branded as Sweet Venom.
            </p>
          </div>
        </article>
      </div>

      <div className="portfolio-project-grid">
        {projects.map((project) => (
          <article key={project.theme} className="portfolio-card" aria-labelledby={`${project.theme}-heading`}>
            <BrandPreview className={`portfolio-logo-stage portfolio-logo-stage--${project.theme}`} href={project.url} label={`Visit ${project.name} website`}>
              <img src={project.logo} alt={`${project.name} logo`} width={project.width} height={project.height} loading="lazy" decoding="async" />
            </BrandPreview>
            <div className="portfolio-card-body">
              <p className="portfolio-project-type">{project.category}</p>
              <h3 id={`${project.theme}-heading`}>{project.name}</h3>
              <p className="portfolio-description">{project.description}</p>
              <ul className="portfolio-tags" aria-label={`${project.name} capabilities`}>
                {project.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
              <div className="portfolio-project-action">
                {project.caseStudy && <Link className="portfolio-link mr-5" to={project.caseStudy}>Read case study</Link>}
                <ProjectLink href={project.url}>Visit website<span className="sr-only">: {project.name}</span></ProjectLink>
                <p className="portfolio-domain">{project.domain}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="portfolio-closing">
        <p>Have something in mind for your business?</p>
        <Link to="/start" className="portfolio-contact-link">Let’s build your next project <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
