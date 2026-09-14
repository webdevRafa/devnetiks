import { Link, useLocation } from "react-router-dom";
import { detailPages } from "@/content/pages";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArrowUpRight from "@/components/ArrowUpRight";
import NotFoundPage from "./NotFoundPage";
import "./DetailPage.css";

export default function DetailPage() {
  const { pathname } = useLocation();
  const page = detailPages.find(item => item.path === pathname.replace(/\/$/, ""));
  if (!page) return <NotFoundPage />;
  return <div className="detail-page">
    <SiteHeader />
    <main id="main-content" className="detail-main">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>{page.kind === "service" ? "Services" : "Selected work"}</span></nav>
      <header className="detail-intro">
        <p className="home-eyebrow">{page.eyebrow}</p>
        <h1>{page.heading}</h1>
        <p className="detail-lead">{page.intro}</p>
        <Link to="/start" className="home-primary-link">Tell us about your project <ArrowUpRight /></Link>
      </header>
      <ul className="detail-highlights">{page.highlights.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ul>
      {page.images?.slice(0, 1).map(image => <figure className="detail-image" key={image.src}><img src={image.src} alt={image.alt} width="1440" height="1000" loading="lazy" decoding="async" /><figcaption>{image.caption}</figcaption></figure>)}
      <div className="detail-content">
        <aside className="detail-outline" aria-label="On this page"><p>{page.kind === "service" ? "The approach" : "Inside the project"}</p>{page.sections.map((section, i) => <a href={`#${section.id ?? `section-${i}`}`} key={section.heading}><span>0{i + 1}</span>{section.heading}</a>)}</aside>
        <div>
          {page.sections.map((section, i) => <section id={section.id ?? `section-${i}`} className="detail-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
          {page.links && <div className="detail-live-links">{page.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="home-primary-link">{link.label}<ArrowUpRight /><span className="sr-only"> (opens in a new tab)</span></a>)}</div>}
        </div>
      </div>
      {page.images?.slice(1).map(image => <figure className="detail-image" key={image.src}><img src={image.src} alt={image.alt} width="1440" height="1000" loading="lazy" decoding="async" /><figcaption>{image.caption}</figcaption></figure>)}
      {page.questions && <section className="detail-questions"><p className="home-eyebrow">Before we begin</p><h2>A few practical questions.</h2>{page.questions.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>}
      <section className="detail-related"><p className="home-eyebrow">Keep exploring</p><h2>{page.kind === "service" ? "See the work behind the approach." : "Explore a related project or service."}</h2><div>{page.related.map(link => <Link to={link.href} key={link.href}><h3>{link.label}<ArrowUpRight /></h3><p>{link.summary}</p></Link>)}</div></section>
      <section className="home-next detail-next"><div><p className="home-eyebrow">Your next chapter</p><h2>Let’s build what’s next.</h2></div><Link to="/start" className="home-primary-link">Start a conversation<ArrowUpRight /></Link></section>
    </main>
    <SiteFooter />
  </div>;
}
