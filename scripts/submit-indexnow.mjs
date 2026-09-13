import { readFile } from "node:fs/promises";

// Run after deployment, never during a preview build. This is a public
// ownership-verification file, not an account password or API credential.
const site = "https://www.devnetiks.com";
const key = (await readFile(new URL("../public/indexnow-key.txt", import.meta.url), "utf8")).trim();
const keyLocation = `${site}/indexnow-key.txt`;
const verification = await fetch(keyLocation);
if (!verification.ok || (await verification.text()).trim() !== key) throw new Error("Deploy and verify the IndexNow key file first.");
const sitemapResponse = await fetch(`${site}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error("Production sitemap is unavailable.");
const sitemap = await sitemapResponse.text();
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (!urlList.length || urlList.some(url => new URL(url).origin !== site)) throw new Error("Unexpected sitemap URLs.");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation, urlList }),
});
if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned HTTP ${response.status}: ${await response.text()}`);
console.log(JSON.stringify({ status: response.status, urls: urlList, result: response.status === 202 ? "Received; ownership validation pending." : "Received successfully.", note: "Submission does not guarantee indexing or ranking." }));
