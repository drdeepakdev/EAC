# ExpertAims homepage — five creative directions

Explored before building, per the redesign brief. Brand constants for all
five: the EAims-2 vector logomark (gradient E + red aim-dot), signature red
`#9E0000`, official dark-surface pair `#f0ede8` / `#ff5a4e`.

## D1 — "Boardroom Ledger" (corporate premium)
Warm paper ground, ink typography, hairline rules, annual-report layout
discipline: big numerals, tabular service index, two-column rhythm. Red used
sparingly as ledger accents. **Strength:** instant premium-consultancy trust.
**Weakness:** low creative temperature; under-sells the build capability.

## D2 — "Ops Room" (enterprise IT consultant)
Charcoal NOC-dashboard language: status chips, uptime tickers, monospace
telemetry, service topology lines. **Strength:** deep technical credibility.
**Weakness:** reads engineer-to-engineer, not consultant-to-business-owner;
overlaps the previous dark build; dark IT sites are the cliché to escape.

## D3 — "Blueprint Survey" (creative technology agency)
Engineering-drawing language on grid paper: dimension lines, annotations,
isometric thin-line system diagrams, red marking-pen highlights.
**Strength:** genuinely distinctive craft feel. **Weakness:** can read as an
architecture firm; annotation density fights quick scanning.

## D4 — "Signal & Paper" (hybrid: premium consulting × working technology)
Warm paper site with editorial serif headlines, mono annotations, hairline
structure — interrupted by exactly one dark "signal" band where the
technology proof lives (set in the official dark logo colors). A custom
thin-line system map is the hero visual: cloud, security, web, apps,
support, growth drawn as one connected schematic around the client's
business. The aim-dot is the recurring status mark. **Strength:** trust of
D1 + credibility of D2 + craft of D3, all on brand; light ground separates
it from every dark AI-styled tech template. **Weakness:** needs discipline
to keep the paper sections from feeling sparse.

## D5 — "Case-First Studio" (creative agency)
Portfolio-led: oversized project work first, services second, like a design
studio. **Strength:** shows rather than tells. **Weakness:** wrong journey
for IT consulting — corporate buyers need services + trust before proof;
current portfolio depth can't carry an opening act.

## Decision: D4 — Signal & Paper
It is the only direction that serves both halves of the audience journey —
the business owner who needs to trust (paper, serif, ledger facts) and the
technical evaluator who needs to believe (signal band, system map, mono
precision) — while staying strictly inside the real brand system. D1's
layout discipline and D3's schematic drawing style are folded in as
supporting techniques.

## v3 — "Enterprise Clean" (client-directed, current)
The client narrowed references to IBM Consulting, Infosys and Accenture and
supplied the homepage structure. Built accordingly: white ground, sharp
corners, IBM Plex Sans/Mono, clickable service tiles with arrow affordances
(IBM), bold typographic hero with the requested headline and split system-map
panel (Accenture), clean six-service journey (Infosys), problem/solution/
outcome case cards, trust strip with selected clients, four-point Why band,
and a WhatsApp-forward contact section listing all three offices. Deliberately
simpler than TCS/Cognizant per the brief. Previous versions preserved as
v1.html (dark editorial) and v2.html (Signal & Paper).

## v4 exploration — five directions for the "motion" round
Brief: keep the logo theme, add sliding hero banners, fold in Infosys
patterns, and migrate content from the live expertaims.com.

- **E1 — Enterprise Motion** (enterprise IT consultant): the approved v3
  Enterprise Clean base + a full-width sliding hero (one slide per service
  story from the live site, rewritten), Infosys-style stat counters, a
  technology-partners strip (HP/Dell/Cisco/Microsoft/Oracle from the live
  about page), and the site's real client testimonials.
- **E2 — Corporate Gradient Premium**: charcoal hero slider with soft red
  gradients and glass cards. Rejected: drifts back toward the generic
  dark-gradient template look the project explicitly avoids.
- **E3 — Creative Tech Agency Motion**: oversized type-per-slide, marquee,
  asymmetric slabs. Rejected: too loud for M365/AMC corporate buyers.
- **E4 — SaaS Product Clean**: centered hero, product screenshots.
  Rejected: wrong genre — ExpertAims sells services, not a product.
- **E5 — Signal & Paper in Motion**: v2's serif paper look with a slider.
  Rejected: client already redirected from serif editorial to IBM/Infosys
  enterprise language in the v3 round.

**Decision: E1 — Enterprise Motion.** It compounds what the client already
approved (v3) instead of resetting, and every added element traces to a
source: sliders and stories from the live site, counters/cards from Infosys,
theme from the EAims-2 brand files.

## v5 — "The Meridian" (current, full multi-page site)
Brief: a complete, never-seen site — dedicated pages, menus/submenus,
scrollers, big and inner banners, light+dark modes, unique type, full
creative freedom, brand colors first.

Concept: the brand's red signal line drawn continuously through the site;
every page is a station on the line (scroll-drawn meridian rail, station
markers, terminus footer). Type: Bricolage Grotesque display + Instrument
Serif italics + Schibsted Grotesk body + Spline Sans Mono annotations —
a set no IT template ships. Both themes are first-class token systems in
the brand palette (porcelain/ink/#9E0000 · charcoal/#F0EDE8/#FF5A4E).

Eight dedicated pages sharing one design system (assets/site.css/js):
home (kinetic hero, marquee, service + project rails, dark why-band with
counters, testimonial slider, insights teaser), services (six anchored
practices + solutions verticals), projects (the real 26-item portfolio
from the live site with filters + case studies), about, clients &
industries (interactive), news & insights (six practice articles in an
accessible reader), innovation (frontier practices + the interactive
Capability Atlas), and contact (channels, three offices with map links,
form, FAQ). Content migrated from the live expertaims.com; mega menus on
desktop, accordion sheet on mobile; WhatsApp everywhere. Prior versions
remain at v1–v4.html.

## v5.1 — innovation round (current)
Three additions, each an extension of the meridian concept rather than a
bolt-on effect:

- **Signal Search** — a command palette (Ctrl/⌘ K, `/`, or the header
  Search button) indexing every page, all six services, offices and
  actions (WhatsApp, email, theme switch). Keyboard-first: arrows,
  Enter, Escape; the aim-dot is the selection marker. Built entirely in
  shared JS — no per-page markup — and styled in both themes.
- **Station-to-station transitions** — cross-document View Transitions
  (progressive enhancement) plus the *signal draw*: a 2px brand-red line
  that draws across the top edge on every page entry, the meridian
  handing the visitor from one station to the next. Disabled under
  `prefers-reduced-motion`.
- **Aim-dot searchlight** — a soft brand-red spotlight that follows the
  pointer across service cards and project art (hover-capable, fine
  pointers only).

## v5.2 — the signal compass (client-directed, current)
The client found the fixed left meridian rail intrusive — it crossed the
footer logo and text. Removed it (and the footer terminus drop), restored
a symmetric page grid, and re-expressed the concept as the **signal
compass**: the aim-dot inside a scroll-progress ring docked bottom-left.
It fills as you travel the page, announces each station by name in a
transient mono pill ("STATION 03 · WHY EXPERTAIMS"), shows the label on
hover, and returns you to the top of the line on click. Appears only
after you start scrolling; hidden on small screens and in print. The
inline station dots and the "End of line" terminus label remain — the
line itself is now something you carry, not something drawn over the
page.

## v5.3 — the AI signal round (client-directed, current)
Brief: highlight the "Ai" inside ExpertAims like an AI development
company, bring back a long banner slider with effects, and beautify the
service and project sections.

- **The "Ai" treatment** — no badge, no sticker: the lockup's own
  letterforms carry it. A light sweep travels through the logo (masked
  by the logo itself), the A–i pair breathes with a living red gradient
  (which also lands on the word TECHNOLOGY in the strapline), and the
  i-dot pings like a radar signal. Pure CSS over the existing SVG,
  theme-aware, removed entirely under reduced motion.
- **Hero banner slider** — five full-height slides: the flagship
  "Technology that holds.", the AI & automation practice, cloud
  migrations, security, and web builds. Each slide has drifting
  conic-gradient art, a masked dot-field and a giant outlined ghost
  glyph (EA · AI · M365 · SEC · WEB). Autoplays with per-dot progress
  bars, pauses on hover/focus/hidden-tab, arrows + dots + swipe +
  keyboard, staggered text reveals, and a static trust bar beneath.
- **Service cards** — bespoke line-art icons per practice, an outlined
  ghost numeral, and a red top rule that draws itself on hover.
- **Project cards** — bespoke line-art motifs per category (browser
  chrome for websites, phone for apps, bezier pen for logos, megaphone
  for brands) behind a smaller corner monogram — the 26 cards no longer
  share one repeated treatment.

## v5.4 — station rails, Infosys hover (client-directed, current)
Station 01 and 02 rails now show exactly three boxes per view on
desktop (two on tablet, one on phone) — no half-cut cards. Card hover
borrows the Infosys tile language: a brand-red fill sweeps up from the
bottom of the card, typography flips to white, the Explore arrow slides
right; project cards zoom their art and slide an arrow into the
red-swept caption strip.

## v6.0 — the master cut (client-directed, current)
Brief: the real numbers are 15,000+ projects and 5,000+ clients; deepen
the case studies; high-resolution imagery and handmade icons; more
interactivity; no AI slop.

- **True scale** — every stat corrected site-wide: 15,000+ projects
  delivered, 5,000+ clients since 2012. The 26-item portfolio is now
  framed honestly as "the public selection."
- **High-resolution art plates** — eleven 1600px/1400px WebP artworks
  generated deterministically in the brand palette (calm charcoal
  fields, ember glows, grain) with hand-drawn motifs: the meridian arc,
  a neural constellation, a rising migration path, radar rings, a
  perspective grid, and per-case signal curves. Hero slides carry them
  as tilted art prints with pointer tilt; case cards use them as
  covers. ~12KB each — high-res without the weight.
- **Case files** — six full case studies (Kidz, 3QARQ8, Onetech,
  Clinic, Al Mohsen Group, Artech Q8) in a modal reader: challenge →
  approach → outcome with handmade section icons (flag, route, target),
  a three-stat strip and a stack chip row. Teaser band on the home page.
- **Handmade icon signature** — every service icon now carries the
  brand's filled aim-dot; case-reader icons drawn in the same hand.
- **Interactivity** — pointer tilt on hero plates and case covers,
  comma-formatted count-ups (15,000), cover zooms, and the existing
  palette/compass/sweep system carried through.
