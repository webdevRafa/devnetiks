import { detailPages } from "./content/pages";
export const SITE_URL = "https://www.devnetiks.com";
export const SOCIAL_IMAGE = `${SITE_URL}/social/devnetiks-share-v1.png`;
export const INDEXABLE_PATHS = ["/", "/start", ...detailPages.map(page => page.path)];
export const PRERENDER_PATHS = [...INDEXABLE_PATHS, "/thank-you", "/404"];

const pages: Record<string, { title: string; description: string; index: boolean }> = {
  "/": {
    title: "San Antonio Web Design & Development | Devnetiks",
    description: "Custom websites and web apps for San Antonio businesses and beyond. Explore Devnetiks’ work in business websites, booking systems, and application development.",
    index: true,
  },
  ...Object.fromEntries(detailPages.map(page => [page.path, { title: page.title, description: page.description, index: true }])),
  "/start": {
    title: "Start Your Website or Web App Project | Devnetiks",
    description: "Tell Devnetiks LLC about your website, custom web app, or booking system. Share your goals and connect with us to discuss scope, timeline, and budget.",
    index: true,
  },
  "/thank-you": {
    title: "Thank You for Reaching Out | Devnetiks",
    description: "Thank you for contacting Devnetiks LLC about your project.",
    index: false,
  },
  "/404": {
    title: "Page Not Found | Devnetiks",
    description: "This page could not be found. Explore Devnetiks websites and web apps, or contact us about your project.",
    index: false,
  },
};

export function getSeo(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = pages[path] ?? pages["/404"];
  const detail = detailPages.find(item => item.path === path);
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const canonical = page.index ? url : null;
  const imageAlt = "Devnetiks — Modern websites. Powerful web apps. Blue and teal Devnetiks emblem on a midnight background.";
  const meta = [
    { name: "description", content: page.description },
    { name: "robots", content: page.index ? "index, follow, max-image-preview:large" : "noindex, follow" },
    { property: "og:site_name", content: "Devnetiks" },
    { property: "og:locale", content: "en_US" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:url", content: canonical ?? `${SITE_URL}/` },
    { property: "og:image", content: SOCIAL_IMAGE },
    { property: "og:image:secure_url", content: SOCIAL_IMAGE },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1731" },
    { property: "og:image:height", content: "909" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:image", content: SOCIAL_IMAGE },
    { name: "twitter:image:alt", content: imageAlt },
  ];
  const organization = {
    "@type": "Organization", "@id": `${SITE_URL}/#organization`,
    name: "Devnetiks", legalName: "Devnetiks LLC", url: `${SITE_URL}/`,
    email: "devnetiks@gmail.com",
    description: "Custom website design, web app development, and booking and payment systems for businesses.",
    logo: { "@type": "ImageObject", url: `${SITE_URL}/devnetiks-emblem.png`, width: 1254, height: 1254 },
  };
  const structuredData = page.index ? {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Devnetiks", alternateName: "Devnetiks LLC", publisher: { "@id": organization["@id"] }, inLanguage: "en" },
      { "@type": path === "/start" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": organization["@id"] }, inLanguage: "en" },
      ...(detail?.kind === "service" ? [{ "@type": "Service", "@id": `${url}#service`, name: detail.title.split(" | ")[0], description: detail.description, url, provider: { "@id": organization["@id"] }, areaServed: { "@type": "City", name: "San Antonio" } }] : []),
      ...(path === "/" ? [
        { "@type": "OfferCatalog", "@id": `${SITE_URL}/#services`, name: "Devnetiks services", itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website design and development", serviceType: "Brochure and marketing websites", provider: { "@id": organization["@id"] }, url: `${SITE_URL}/#services-heading` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom web app development", serviceType: "Data-backed web applications", provider: { "@id": organization["@id"] }, url: `${SITE_URL}/#services-heading` } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Booking and payment systems", serviceType: "Online booking and payment integration", provider: { "@id": organization["@id"] }, url: `${SITE_URL}/#services-heading` } },
        ] },
      ] : [
        { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: detail?.title.split(" | ")[0] ?? "Start a project", item: url },
        ] },
      ]),
    ],
  } : null;
  return { ...page, canonical, meta, structuredData };
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderSeoHead(pathname: string) {
  const seo = getSeo(pathname);
  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    ...seo.meta.map(tag => `<meta ${tag.name ? `name="${tag.name}"` : `property="${tag.property}"`} content="${escapeHtml(tag.content)}" />`),
    seo.canonical ? `<link rel="canonical" href="${seo.canonical}" />` : "",
    seo.structuredData ? `<script id="structured-data" type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, "\\u003c")}</script>` : "",
  ].join("\n    ");
}
