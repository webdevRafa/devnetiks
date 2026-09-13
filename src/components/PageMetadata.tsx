import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeo } from "@/seo";

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = getSeo(pathname);
    document.title = seo.title;
    for (const tag of seo.meta) {
      const attribute = tag.name ? "name" : "property";
      const key = tag.name ?? tag.property!;
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = tag.content;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (seo.canonical) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
      canonical.href = seo.canonical;
    } else canonical?.remove();
    let data = document.getElementById("structured-data");
    if (seo.structuredData) {
      if (!data) { data = document.createElement("script"); data.id = "structured-data"; data.setAttribute("type", "application/ld+json"); document.head.append(data); }
      data.textContent = JSON.stringify(seo.structuredData);
    } else data?.remove();
  }, [pathname]);
  return null;
}
