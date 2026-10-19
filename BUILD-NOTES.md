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

Deploy `dist/` to any static host. `netlify.toml` is included (Netlify Forms work out of the box).

Environment variables (see `.env.example`):

- `VITE_FORM_ENDPOINT` — set to a Formspree URL to switch forms away from Netlify Forms.
- `PLAUSIBLE_DOMAIN` — enables Plausible analytics; nothing loads if unset.

## How to edit content

All content is JSON in `src/content/`:

- `site.json` — contact details, registration, documents, map, impact stats (`published`), gallery (`published`)
- `programmes.json` — all six programme pages
- `team.json`, `partners.json`, `news.json`, `timeline.json`, `locations.json`, `gallery.json`
- `pages.json` — values, approach pillars, partnership ways, who we serve

**CMS:** Decap CMS is configured at `/admin` (`public/admin/config.yml`). TODO: choose auth on the host — Netlify Identity + Git Gateway (uncomment the widget script in `public/admin/index.html`) or GitHub OAuth.

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

1. Vector logo (`src/components/Logo.jsx`, `public/favicon.svg`)
2. Team names, bios, photos
3. Second phone number / WhatsApp confirmation
4. Domain (`site.json → url` is `https://reliefsouthsudan.info`) and hosting
5. Professional email on the domain
6. Photo consent + captions for P1–P7, P3 clearance
7. Hero and programme photography (WASH, girls, women)
8. Founding story and milestones (`timeline.json`)
9. Impact figures
10. Operating locations (`locations.json`)
11. Consented stories
12. Partner logos, permission, blurbs
13. Donation route (Phase 2 — not built)
14. Safeguarding and privacy policy text
15. Social accounts
16. Office hours and exact map pin
17. Annual report
18. Clean registration certificate scan
