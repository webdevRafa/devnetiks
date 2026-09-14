# Devnetiks

Public marketing and contact website for **Devnetiks LLC**, built with React, TypeScript, Tailwind CSS, and Vite. The navbar uses Devnetiks with the supplied emblem; every page identifies Devnetiks LLC as the owner.

## Development

Use Node.js 22.12+ (or a supported newer LTS release).

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run test:seo
npm run preview
```

## Contact delivery — one-time activation required

The form at `/start` submits directly to [FormSubmit](https://formsubmit.co/documentation) for delivery to **devnetiks@gmail.com**. It uses native browser validation, a honeypot, and FormSubmit's default CAPTCHA. The visitor's email is used for Reply-To. No account, database, backend function, or API key is required by this application.

Before accepting inquiries:

1. Submit a test inquiry from the deployed website and complete the provider's spam check.
2. Open the FormSubmit activation email sent to devnetiks@gmail.com (check spam) and activate the form.
3. Submit another test from the production domain and confirm both delivery and Reply-To. Repeat activation if the provider requests it for another domain.

Delivery is not verified until this activation and mailbox test are complete. FormSubmit handles the request off-site; the form discloses this to visitors. After submission, the provider returns visitors to `https://www.devnetiks.com/thank-you`. A direct mailto link is available on every page if the service is unavailable. Never put sensitive information in test submissions.

## Deployment

Pushes to the branch connected to Vercel use the existing Git deployment integration. Build command: `npm run build`; output directory: `dist`. The build prerenders the public pages into complete HTML and then hydrates them for interaction. `vercel.json` enables clean URLs and permanent redirects for retired routes; unknown URLs use `404.html` with an HTTP 404 response. No Firebase environment variables are needed.

## Search and social previews

`src/content/pages.ts` holds service and case-study content. `src/seo.ts` is the shared source for initial HTML metadata and client-side navigation updates. The build generates `sitemap.xml` and `robots.txt`. The homepage, `/start`, two service pages, and the SATX INK case study are indexable; the confirmation and missing-page templates carry `noindex, follow`. The social preview is `public/social/devnetiks-share-v1.png`. When replacing it, use a new versioned URL and update the dimensions in `src/seo.ts`.

Run `npm run build` and `npm run test:seo` before deploying. After deployment, `node scripts/submit-indexnow.mjs` verifies the public ownership file and submits production sitemap URLs to IndexNow. It is intentionally not run during builds, which also run for previews. See [SEO setup and maintenance](docs/seo.md) for the Google Search Console step and validation links.

## Removed functionality

Authentication, client/admin dashboards, organizations, projects, invoices, quotes, CRM utilities, Firebase initialization, and their unused dependencies have been removed. Retired login, client, app, and invoice URLs permanently redirect to the public homepage. The existing Firebase service and any previously stored records are not changed by this repository update; retire those separately if no other application uses them.

The original user-supplied emblem is in `public/devnetiks-emblem.png`, used by the navbar, confirmation page, favicon, and touch icon.

## Procedural hero sculpture

The homepage uses a lazy-loaded React Three Fiber / Three.js scene built from geometry, with no external models or textures. `HeroSculpture.tsx` provides the prerendered SVG fallback, visibility tracking, and pause control; `HeroScene.tsx` owns the scene. Rendering pauses outside the viewport or in a hidden tab. Reduced-motion visitors receive the static artwork without downloading the scene. The fixed aspect ratio reserves layout space. WebGL initialization failures and context loss retain the static fallback. Pixel ratio is capped at 1.5, and the scene uses no postprocessing or shadows.

## Desktop project workspace

At 1024px and above, the projects section uses a lazy-loaded 3D desk with the owner-supplied website screenshots as sRGB screen textures. Device clicks and keyboard-accessible project buttons select a project; camera transitions respect reduced motion. Rendering is on demand and suspended offscreen. The static preview and project controls remain usable if WebGL fails. Mobile and no-JavaScript visitors retain the original project list. All site and case-study links remain ordinary HTML links.
