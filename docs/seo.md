# Devnetiks search and social setup

Primary website: https://www.devnetiks.com/

## What is included

- Complete prerendered HTML for the homepage and contact page, including visible services and all five portfolio entries. Visitors and crawlers receive the same content.
- Unique titles/descriptions, canonical URLs, Open Graph and large-image Twitter/X metadata in the initial HTML. Metadata also updates during client navigation.
- Organization, WebSite, WebPage/ContactPage, service catalog, and contact breadcrumb structured data. No invented address, ratings, prices, or location claims.
- Sitemap: https://www.devnetiks.com/sitemap.xml
- Crawl directives: https://www.devnetiks.com/robots.txt
- A versioned PNG social card: https://www.devnetiks.com/social/devnetiks-share-v1.png (1731 × 909 pixels, approximately 1.91:1).
- Confirmation/missing pages marked `noindex, follow`; missing URLs return HTTP 404 in production. Permanent redirects retain known retired URLs.
- Smaller client JavaScript, stable image dimensions, and the existing accessible scroll-aware navbar and portfolio interactions.
- IndexNow submission support for participating search engines. The verification file is public by design. An accepted submission is not proof of indexing.

## Google: one account-side setup step

The browser connection to Search Console was unavailable during this update, so ownership verification and Google sitemap submission were not completed.

1. Open [Google Search Console](https://search.google.com/search-console) and sign in with the Google account you want to own the website property.
2. Add a **Domain** property and enter **devnetiks.com** (no `https://` or `www`). If the property is already verified, select it and skip to step 5.
3. Google supplies a unique TXT verification value. In Namecheap → Domain List → devnetiks.com → Manage → Advanced DNS → Add New Record, select **TXT Record**, Host **@**, Value **the exact google-site-verification value Google provides**, TTL **Automatic**. Save it. Keep your existing A, CNAME, and email records.
4. Return to Search Console and click **Verify**. If DNS has not updated yet, retry later without changing the value.
5. Open **Sitemaps** and submit **https://www.devnetiks.com/sitemap.xml**.
6. Use **URL inspection** for **https://www.devnetiks.com/**, run the live test, then choose **Request indexing**. Repeat for **https://www.devnetiks.com/start**.
7. Check the Pages and Performance reports after Google has processed the site. Submission does not guarantee indexing, ranking, or a particular processing time.

[Google's Search Console guide](https://developers.google.com/search/docs/monitor-debug/search-console-start) explains property verification and monitoring. [Google's sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) explains submission and discovery.

## Facebook and other link previews

Share **https://www.devnetiks.com/**. The card is included automatically through the page's Open Graph metadata. Existing posts may retain cached previews; open [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), enter the homepage URL, and use **Scrape Again** when available. Different platforms can crop or present the preview differently.

Validate the deployed homepage with [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/). Valid structured data does not guarantee a special search result. See [Open Graph](https://ogp.me/) and [Google Organization markup](https://developers.google.com/search/docs/appearance/structured-data/organization).

## Maintaining visibility

- Keep portfolio descriptions, links, and contact information accurate. Add substantial case studies when project details and outcomes can be supported; do not invent results or create thin pages just to target keywords.
- If targeting a specific city or service area, first confirm the actual location/service area and add it naturally to visible copy. The site currently makes no unverified local-business claims.
- For each future public page, add its metadata and prerender path to `src/seo.ts`; add it to the indexable paths only when it should appear in search. Run `npm run build`, `npm run lint`, and `npm run test:seo`.
- After a meaningful production content update, run `node scripts/submit-indexnow.mjs`. The script reads the deployed sitemap, checks the ownership file, and submits only canonical URLs. See [IndexNow documentation](https://www.indexnow.org/documentation).
- Use Search Console data to identify actual search terms and improve the matching page. Seek relevant links and referrals from real business relationships; technical SEO alone does not establish search authority.

## Social card provenance

Created with the built-in image-generation tool using the existing Devnetiks emblem as the reference. No external image-generation API was used. The generated file was copied unchanged into `public/social/devnetiks-share-v1.png`; the delivered copy is `outputs/devnetiks-social-card.png` in the Codex task directory. The actual output dimensions are declared in the social metadata.

Final generation prompt:

> Create one finished premium social sharing Open Graph brand card for Devnetiks LLC, landscape exactly 1200 by 630 pixels (1.905:1). Supporting reference is the official Devnetiks emblem: preserve the distinctive circular blue-cyan circuit DN monogram, accurately incorporate it large on the right side, no redesign. Sophisticated technology design studio, midnight charcoal #0B0D12 background, subtle atmospheric cobalt and teal light, very fine restrained flowing circuit lines in the background with lots of negative space. Editorial clean Swiss-style typography on left, perfectly legible at thumbnail scale, ample safe margin 65px all sides. Exact text only: small top left 'Devnetiks'; large bold white headline split into two lines 'Modern websites.' then 'Powerful web apps.' with second line blue to teal gradient. Smaller supporting line 'Designed to stand out. Built to work.' Bottom left understated 'devnetiks.com' and bottom right small 'Devnetiks LLC'. No browser mockup, no device mockup, no buttons, no client logos, no invented claims, no extra text, no watermark. Emblem right approximately 350px diameter; composition should have balanced spacing so emblem does not overlap headline. Crisp polished restrained design, beautiful subtle lighting, ready for Facebook link previews.
