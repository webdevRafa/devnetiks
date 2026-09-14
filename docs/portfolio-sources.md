# Portfolio content and asset sources

The homepage portfolio presents four brands across five builds. Project names and authorship were supplied by the owner. Descriptions were checked against the projects' public-facing pages and documentation on September 13, 2026. Assets are copied unchanged; no application code, credentials, customer records, or backend dependencies are copied from these repositories.

## Brand artwork

| Devnetiks asset in `public/portfolio/` | Source repository and path | Source commit |
| --- | --- | --- |
| `satxink.svg` | `webdevRafa/satxink` — `src/assets/satx-ink-modern-optical.svg` | `a838474513f9603c1aa24a578d3620c18b13c095` |
| `sweet-venom-logo.png` | `webdevRafa/tattoo-system` — `public/brand/sweet-venom/sweet-venom-logo.png` | `d6fce01fa5d456f4699d1c1a3286e88e36a790c6` |
| `roofzeus.webp` | `webdevRafa/roofzeus` — `public/brand/v8/logo-dark.webp` | `964f3315b515d69bdc19f3230dc2c1d137127df7` |
| `rancho-de-paloma-blanca.webp` | `webdevRafa/rancho-de-paloma-blanca` — `public/logo-official.webp` | `6b73ace8fbc54d5789cdea8bcf9593d4b1cc7d2e` |

## Public destinations

- SATX INK Marketing: <https://www.satxink.com/> — marketing copy and navigation in `src/marketing/MarketingSite.tsx`.
- SATX INK System: <https://demo.satxink.com/> — the public demo linked from SATX INK's marketing site. The `tattoo-system` README describes artist/flash, booking, deposit, and shop workspace capabilities. The demo is explicitly identified as Sweet Venom; it is not listed as an additional client project.
- RoofZeus: <https://roofzeus.com/> — canonical URL in `index.html`; guided estimate flow in `src/public-site/EstimateFunnel.tsx`.
- Rancho de Paloma Blanca: <https://www.ranchodepalomablanca.com/> — public homepage matches `src/pages/HomePage.tsx`, including the ranch story and hunt reservation links.

All destinations returned HTTP 200 when checked. Portfolio links open in a new tab with `noopener noreferrer`; the system link goes to the public demo, not an admin workspace or source repository. Future updates belong in `src/components/PortfolioSection.tsx` and its companion stylesheet. Logos load lazily with reserved display dimensions.

## Homepage interaction

The logo previews are public website links. `BrandPreview.tsx` updates local CSS coordinates for a mouse-following light; only fine pointers with hover and no reduced-motion preference enable tracking. Touch retains the original static artwork and background. Keyboard focus adds a centered light and a visible outline. All motion is decorative, and the source brand files are unchanged.

## Case-study screenshots — 2026-09-14

Screenshots in `public/work/` capture the public marketing homepages at https://www.satxink.com/, https://demo.satxink.com/ (Sweet Venom demonstration studio). Captured at 1440 × 1000 with reduced motion. Descriptions were checked against the public sites and the existing read-only project source snapshots. They describe implemented workflows, not measured business outcomes. Sweet Venom is a system demo, not an additional client.

The first SATX INK case-study image was replaced with the owner-supplied `Screenshot 2026-09-14 150359.png`, converted to WebP at quality 85 without cropping or resizing. Its native dimensions are declared to reserve the correct layout space. The Sweet Venom screenshot remains unchanged.

## Desktop workspace textures

Owner-supplied screenshots from 2026-09-14: `162035` is SATX INK on the monitor, `162116` is Rancho de Paloma Blanca on the left laptop, and `162152` is RoofZeus on the phone. Optimized WebP copies are in `public/workspace/`, preserving the full image and its aspect ratio (1600×742, 1600×839, and 477×864). These are static screen previews, not live embedded websites. Combined transfer size is 257,932 bytes.
