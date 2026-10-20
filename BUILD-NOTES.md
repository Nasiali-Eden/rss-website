# Relief South Sudan website — build notes

## What was built

A fast, static website for Relief South Sudan, built with **Vite + React** (as requested, replacing the Astro stack in the handoff) and **prerendered to plain HTML** at build time. Every page loads as finished HTML, works without JavaScript, is fully indexable, and then hydrates for interactive bits (menu, mega-menu, forms, map, gallery).

Pages (all built from `design-reference/HANDOFF.md` and the reference HTML):

| Route | Notes |
|---|---|
| `/` | Hero, who we are, 6 programme cards (swipe row on mobile), vision band, approach, sunrise CTA. Impact stats, featured story and partner strip are hidden until real content exists. |
| `/about` | Page hero, who we are, vision/mission, values, approach, accountability `<dl>`, navy CTA. Timeline hidden until ≥ 2 real entries. |
| `/what-we-do` | Hub (not designed — built from spec): alternating image/text rows. |
| `/what-we-do/[slug]` ×6 | Programme template generated from `src/content/programmes.json`. |
| `/impact` | Page hero, South Sudan map (Natural Earth outline, Torit pin), who we serve (11 groups). Stats, gallery and stories hidden by default. |
| `/team` | Header + "Join our team" band. Removed from nav and sitemap until `team.json` has members. |
| `/partner` | Five ways (anchors `#funding` … `#resources`), who we work with, enquiry form (`?interest=prayer` pre-checks). Header CTA reads "Start a Conversation" → `#enquiry`. |
| `/contact` | Details card, static-first map, contact form (`?subject=volunteer` pre-selects). |
| `/safeguarding`, `/privacy` | Text pages with "Policy coming soon" (TODO: client text). |
| `/news`, `/news/[slug]` | Phase 2 scaffold, `noindex`, not in nav or sitemap. |
| `/404` | On-brand, links Home and Contact. |

Components live in `src/components/` (SiteHeader with mega-menu + mobile drawer, SiteFooter, Logo, Button, Icon, Hero, cards, bands, Breadcrumb, Form primitives, PhotoPlaceholder, MapEmbed, Gallery, SouthSudanMap).

## How to run it

Requires Node 20+.

```bash
npm install
npm run dev       # local dev server (shows hatched photo placeholders with labels)
npm run build     # builds + prerenders everything into dist/
npm run preview   # serve the build
```

Hosted on **Vercel**. `vercel.json` sets the build (`npm run build` → `dist/`), clean URLs and the cache/security headers. Import the GitHub repo in Vercel; every push to `main` deploys.

Forms: with `VITE_FORM_ENDPOINT` empty, submitting a form opens the visitor's email app pre-filled and addressed to `site.email`. For in-page sending, create a Formspree form and set `VITE_FORM_ENDPOINT` in Vercel, then redeploy.

Environment variables (see `.env.example`):

- `VITE_FORM_ENDPOINT` — a Formspree URL; submissions are then sent in-page instead of via the visitor's email app.
- `PLAUSIBLE_DOMAIN` — enables Plausible analytics; nothing loads if unset.

## How to edit content

All content is JSON in `src/content/`:

- `site.json` — contact details, registration, documents, map, impact stats (`published`), gallery (`published`)
- `programmes.json` — all six programme pages
- `team.json`, `partners.json`, `news.json`, `timeline.json`, `locations.json`, `gallery.json`
- `pages.json` — values, approach pillars, partnership ways, who we serve

**CMS:** Decap CMS is configured at `/admin` (`public/admin/config.yml`). It uses the GitHub backend; TODO: deploy a GitHub OAuth proxy and set `base_url` in `config.yml` so editors can log in.

**Photos:** drop the client's photos in `src/assets/photos/` as `p1.jpg` … `p7.jpg`. Anything missing renders a placeholder; nothing crashes. Strip EXIF/GPS before committing (e.g. `exiftool -all= p1.jpg`).

**Documents:** put PDFs in `public/docs/` and set the path in `site.json → documents` (e.g. `"certificate": "/docs/rrc-certificate.pdf"`). Links stay hidden while the value is `null`.

## Content-safety rules built in

- Partners render only with `permission: true` (both current partners are `false` until confirmed).
- Stories/news render only with `published: true` **and** `consent: true`.
- Impact stats render only if `published` and every value is a real number.
- Second phone number (+257…) is not in the codebase at all.
- "Pending" pills from the comps are never rendered. Production placeholders show only the sunrise motif, no label text.
- P3 is not used (awaiting clearance); P1 is used in its place.
- Girls' programme has no photo by design.

## Deviations from the handoff

| Deviation | Reason |
|---|---|
| Vite + React instead of Astro | Client request. Prerendering (`scripts/prerender.mjs`) keeps the Astro benefits: static HTML, no-JS fallback, full SEO. JS bundle ≈ 104 KB gzipped (React + router) is loaded for hydration. |
| One global stylesheet (`src/styles/global.css`) instead of scoped component styles | Plain CSS with no extra tooling; classes are component-namespaced. |
| No `<Picture>` AVIF/WebP pipeline | Vite has no built-in equivalent of Astro `<Image>`. Photos are served as supplied with width/height + lazy loading. Recommended: add `vite-imagetools` once photos arrive, or pre-export AVIF/WebP. |
| EXIF stripping is a manual step | Same reason as above — run `exiftool -all=` on photos before adding them. |
| Content files are `{ "key": [...] }` objects | Decap CMS needs an object at the top level of a file. |
| Mega-menu: "What We Do" is a link plus a separate chevron `<button>` | Gives the required no-JS fallback (plain link to `/what-we-do`) without a hydration mismatch. |
| Partner cards on `/partner` and the Home strip are hidden | Neither partner has `permission: true` yet. |
| What We Do hub & Impact headlines for sub-sections ("Rooted in Torit…", "Reaching those most in need.") | Spec gave body copy but no H2s; short headings added to keep the heading order valid. Edit freely. |
| Lighthouse / axe not run in this build | Run `npx lighthouse` and `@axe-core/playwright` against `npm run preview` before launch. Manual checks done: no horizontal scroll at 375/1440, drawer focus trap + Esc, mega-menu keyboard, form consent enforced, query pre-select, no placeholders in `dist/`. |

## Open items still placeholders

1. Vector (SVG) version of the logo — currently a background-removed raster (`src/assets/brand/`, `public/logo.png`, favicons in `public/`)
2. Team names, bios, photos (Board and Director are done on the Governance page, `src/content/governance.json`)
3. Second phone number / WhatsApp confirmation
4. Domain (`site.json → url` is `https://reliefsouthsudan.info`) and hosting
5. Professional email on the domain
6. P3 clearance (T-shirt text). Photo consent for all gallery photos (P1–P11) was confirmed by the client on 2026-10-20; gallery is published.
7. Hero and programme photography (WASH, girls, women)
8. Founding story and milestones (`timeline.json`)
9. Impact figures
10. Operating locations (`locations.json`)
11. Consented stories
12. Partner blurbs, a larger Action Five logo, and a website link for AIC South Sudan (logos and permission done, `src/content/partners.json`)
13. Donation route (Phase 2 — not built)
14. Safeguarding and privacy policy text
15. Social accounts
16. Office hours and exact map pin
17. Annual report
18. Clean registration certificate scan
