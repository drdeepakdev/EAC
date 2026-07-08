# ExpertAims Consultancy — Website

A single-page marketing site for **ExpertAims Consultancy (EAC)** — an
international IT consultancy headquartered in Thiruvananthapuram, India, with
offices in Kelana Jaya, Malaysia and Safat, Kuwait. ISO 9001:2008 certified,
15,000+ projects delivered since 2012 across Technology, Consulting, and
Outsourcing.

> *"We show up. We follow through."*

## Design — "The Meridian" (v5, multi-page)

The current site is a full multi-page build — "The Meridian" — documented in
`DIRECTIONS.md`: every page a station on the brand's signal line, marked by
a scroll-progress **signal compass** (bottom-left) that names each station
as you pass it and returns you to the top of the line. Eight dedicated
pages (home, services, projects,
about, clients, news, innovation, contact) share one design system
(`assets/site.css` / `site.js`) with mega menus, horizontal snap rails,
big and inner banners, a kinetic hero, an interactive Capability Atlas, and
first-class light + dark themes in the brand palette. Type: Bricolage
Grotesque · Instrument Serif · Schibsted Grotesk · Spline Sans Mono. Earlier
versions are preserved at `v1.html`–`v4.html`. Principles carried through
every version:

- **Official brand palette** taken from the EAims-2 vector sources: signature
  red `#9E0000`, near-black `#0a0807`, grays `#0F0F0F` / `#646464` — matching
  the logomark's gradient "E" swoosh and its red aim-dot.
- **Vector logos** (`logo-e.svg`, `logo-full.svg`) reconstructed from the
  original Illustrator/PDF files with true SVG gradients — crisp at any size.
- **The aim-dot motif**: the red dot from the logomark recurs as brand
  punctuation (hero headlines, footer tagline, OG card).
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
