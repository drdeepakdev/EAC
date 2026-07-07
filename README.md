# ExpertAims Consultancy — Website

A single-page marketing site for **ExpertAims Consultancy (EAC)** — an
international IT consultancy headquartered in Thiruvananthapuram, India, with
offices in Kelana Jaya, Malaysia and Safat, Kuwait. ISO 9001:2008 certified,
15,000+ projects delivered since 2012 across Technology, Consulting, and
Outsourcing.

> *"We show up. We follow through."*

## Design

An Accenture-inspired, editorial-technology visual language — deliberately
built without stock photography. Every visual (hero, case studies, portfolio,
careers) is original CSS/SVG art in the brand's own black-and-red language,
not a generic Unsplash/AI-slop treatment:

- **Black-and-signature-red** palette (`#0a0807` / `#B01010`), matching the
  real ExpertAims logomark's black-to-red duotone "E" swoosh.
- **Outfit** (display) + **Inter** (body) typography.
- Full-bleed hero with an auto-playing headline slider, animated gradient
  blobs, grain texture, and a parallax 3D-extruded logo — pure abstract art,
  no stock photography.
- A scrolling capability ticker and a "How we work" (Discover → Plan → Build →
  Support) process section for added substance.
- Tabbed services showcase (Technology / Consulting / Outsourcing), a
  filterable portfolio grid and case-study carousel rendered as bespoke
  technical-schematic icon cards (dot-grid + radial glow + line-art icon per
  category), awards, a careers section with a live vacancies + apply flow
  (culture reinforced by a "Respect / Responsibility / Ownership" pillar
  panel instead of a stock team photo), and a validated contact form.
- Light/dark theme that follows the OS setting by default and remembers an
  explicit user choice.
- Accessible: skip-free semantic landmarks, `:focus-visible` styling, and full
  `prefers-reduced-motion` support.

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | The entire site — markup, styles, and scripts in one file |
| `404.html` | Branded not-found page (auto-served by GitHub Pages) |
| `robots.txt`, `sitemap.xml` | Crawler directives and sitemap for expertaims.com |
| `assets/brand/logo-e.png` | The "E" logomark (nav icon, favicon, 3D hero effect) |
| `assets/brand/logo-full.png` | Full wordmark + tagline lockup (nav hover state) |
| `assets/brand/logo-e-dark.png`, `logo-full-dark.png` | Light-on-dark logo variants (404 page; kept for future dark-background placements) |
| `assets/brand/og-image.png` | 1200×630 social-share card (Open Graph / Twitter) |

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Pushes to `main` deploy automatically to **GitHub Pages** via
`.github/workflows/pages.yml`. Enable Pages in the repository settings
(Source → GitHub Actions) to activate.

## Notes

- No external image dependencies anywhere on the page — case studies,
  portfolio, and careers visuals are all self-contained CSS/SVG, so the site
  has zero hotlink risk and loads instantly. Swap in real project photography
  later only if desired; it's not required.
- The contact and careers "apply" forms are front-end only: contact submits
  show an inline confirmation, and careers applications open a pre-filled
  `mailto:` draft to `careers@expertaims.com`. Wire up a real form backend
  (e.g. Formspree, a serverless function) before relying on either in
  production.
