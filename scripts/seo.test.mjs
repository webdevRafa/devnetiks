import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = file => readFile(new URL(`../dist/${file}`, import.meta.url), "utf8");
const head = html => html.split("</head>")[0];
const origin = "https://www.devnetiks.com";

test("public pages ship unique SEO metadata and readable content without JavaScript", async () => {
  const titles = new Set();
  for (const [file, path, heading] of [["index.html", "/", "Modern web apps"], ["start.html", "/start", "Start a project"]]) {
    const html = await read(file);
    const metadata = head(html);
    assert.match(html, new RegExp(`<h1[^>]*>${heading}`));
    assert.match(html, /data-prerendered="true"/);
    assert.doesNotMatch(html, /<div id="app-loading"/);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
    assert.equal((metadata.match(/<title>/g) ?? []).length, 1);
    titles.add(metadata.match(/<title>(.*?)<\/title>/)[1]);
    assert.ok(metadata.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.match(metadata, /name="robots" content="index, follow, max-image-preview:large"/);
    assert.match(metadata, /property="og:image" content="https:\/\/www.devnetiks.com\/social\/devnetiks-share-v1.png"/);
    assert.match(metadata, /name="twitter:card" content="summary_large_image"/);
    const data = JSON.parse(metadata.match(/<script id="structured-data" type="application\/ld\+json">(.*?)<\/script>/)[1]);
    assert.equal(data["@context"], "https://schema.org");
    assert.ok(data["@graph"].some(entity => entity.legalName === "Devnetiks LLC"));
    assert.doesNotMatch(JSON.stringify(data), /aggregateRating|reviewCount|streetAddress/);
  }
  assert.equal(titles.size, 2);
  const home = await read("index.html");
  for (const project of ["SATX INK Marketing", "SATX INK System", "RoofZeus", "Rancho de Paloma Blanca", "Roger’s Roofing"]) assert.ok(home.includes(project));
  assert.doesNotMatch(home, /opacity:0/);
  assert.match(await read("start.html"), /value="https:\/\/www.devnetiks.com\/thank-you"/);
});

test("sitemap includes only indexable canonical pages; robots permits crawling", async () => {
  const sitemap = await read("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, [`${origin}/`, `${origin}/start`]);
  const robots = await read("robots.txt");
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.match(robots, /User-agent: \*\nAllow: \//);
  for (const file of ["thank-you.html", "404.html"]) {
    assert.match(head(await read(file)), /name="robots" content="noindex, follow"/);
    assert.doesNotMatch(head(await read(file)), /rel="canonical"/);
  }
});

test("social card is a supported landscape PNG with accurate declared dimensions", async () => {
  const image = await readFile(new URL("../dist/social/devnetiks-share-v1.png", import.meta.url));
  assert.equal(image.subarray(1, 4).toString(), "PNG");
  const width = image.readUInt32BE(16), height = image.readUInt32BE(20);
  assert.ok(width >= 1200 && width / height > 1.9 && width / height < 1.92);
  assert.ok(image.length < 8 * 1024 * 1024);
  const metadata = head(await read("index.html"));
  assert.ok(metadata.includes(`property="og:image:width" content="${width}"`));
  assert.ok(metadata.includes(`property="og:image:height" content="${height}"`));
});

test("hosting serves real pages instead of a catch-all homepage rewrite", async () => {
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(config.cleanUrls, true);
  assert.equal(config.rewrites, undefined);
  assert.ok(config.redirects.some(route => route.source === "/contact" && route.destination === "/start" && route.permanent));
  assert.match(await read("404.html"), /This page isn’t here/);
});
