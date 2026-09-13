import { readFile, writeFile } from "node:fs/promises";
import { render, INDEXABLE_PATHS, PRERENDER_PATHS, SITE_URL } from "../dist-ssr/entry-server.js";

const template = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
for (const path of PRERENDER_PATHS) {
  const { html, head } = render(path);
  const document = template
    .replace(/<!--seo-head-start-->[\s\S]*?<!--seo-head-end-->/, head)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${html}</div>`)
    .replace(/<!--boot-start-->[\s\S]*?<!--boot-end-->/, "");
  const filename = path === "/" ? "index.html" : `${path.slice(1)}.html`;
  await writeFile(new URL(`../dist/${filename}`, import.meta.url), document);
  console.log(`Prerendered ${path}`);
}
const urls = INDEXABLE_PATHS.map(path => `<url><loc>${SITE_URL}${path}</loc></url>`).join("\n  ");
await writeFile(new URL("../dist/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ${urls}\n</urlset>\n`);
await writeFile(new URL("../dist/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
