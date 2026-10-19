# Relief South Sudan website: build handoff for Claude Code

You are building the public website for **Relief South Sudan (RSS)**. RSS is a South Sudanese, community-based Christian non-profit based in Torit, Eastern Equatoria. The design is approved as wireframes and comps. Your job is to turn it into a production static site.

Read this whole file before writing code. When this file conflicts with the screenshots, **this file wins**. When it conflicts with `reference/*.html`, the reference HTML wins on exact visual values (spacing, sizes, colours), and this file wins on structure, behaviour and content rules.

---

## 0. What's in this package

```
HANDOFF.md                 ← you are here
design/tokens.css          ← every colour, font, size, radius. Use these, do not invent values.
content/programmes.json    ← full copy for all 6 programme pages (only 1 is designed; the other 5 use the same template)
reference/*.html           ← static, self-contained HTML of every designed board. Open in a browser.
  index.html               Home, desktop (fluid)
  home-mobile.html         Home, mobile 375px (the REAL mobile pattern: hamburger header, swipe cards)
  programme.html           Programme template, filled with Bible Translation & Literacy
  about.html               About Us
  partner.html             Partner With Us (incl. enquiry form)
  contact.html             Contact (form, details, map placeholder)
  styles.html              Design-system sheet
screenshots/*.png          ← full-page captures of the above (1440 wide, mobile 375)
```

The reference HTML uses inline styles because it was exported from a design canvas. **Do not ship inline styles.** Rebuild it as components with the tokens below. Treat the reference as a pixel spec, not as code to copy.

Screenshots:

| Page | File |
|---|---|
| Home, desktop | `screenshots/index-1440.png` |
| Home, mobile | `screenshots/home-mobile-375.png` |
| Programme template | `screenshots/programme-1440.png` |
| About | `screenshots/about-1440.png` |
| Partner | `screenshots/partner-1440.png` |
| Contact | `screenshots/contact-1440.png` |
| Design system | `screenshots/styles-1440.png` |

---

## 1. Stack (decided; don't re-litigate)

- **Astro** (latest stable), static output, zero client JS by default. Most visitors are on slow mobile data in South Sudan, so performance is a hard requirement.
- **Plain CSS**: one global `tokens.css` plus scoped component styles. No Tailwind, no UI kit.
- **Content collections**: programmes, team, news, partners as Markdown/JSON in `src/content/`. Non-developers must be able to edit them.
- **Decap CMS** (git-based) at `/admin` for News, Team, Partners and Programmes. Wire up the config. Leave auth as a TODO for whatever host is chosen (Netlify Identity or GitHub OAuth).
- **Forms**: a provider-agnostic handler. Default to Netlify Forms attributes, behind a `FORM_ENDPOINT` env var so it can switch to Formspree. Honeypot field required. Never collect payment data.
- **Fonts**: self-host Fraunces (400, 600) and Source Sans 3 (400, 600, 700) as WOFF2 subsets with `font-display: swap`. No Google Fonts request at runtime.
- **Images**: Astro `<Image>`/`<Picture>` with AVIF and WebP, `srcset`, `loading="lazy"` on everything below the fold, explicit width and height.
- Node 20+. Package manager: npm.

If the client later insists on WordPress, the component inventory in §5 maps 1:1 to block patterns. That is not in scope now.

---

## 2. Global rules (non-negotiable)

1. **British English** everywhere: organisation, programme, centre, recognise.
2. **Never invent facts.** No made-up numbers, names, dates, quotes or partners. Anything unknown is a `[Placeholder]` driven by content data, so it can be filled in without touching code.
3. **Hide unfinished content.** Sections that wait on client content (impact stats, stories, field updates, team bios) are behind a per-section `published: true/false` flag in content, and are **hidden by default at launch**. The orange "pending" pills in the comps are design annotations. **Never render them in production.**
4. **Safeguarding.** Never show full names or locations of children, girls or trauma/GBV survivors in images, captions, alt text, filenames or metadata. Strip EXIF and GPS from every image at build time (`sharp` with `.withMetadata(false)`, which is the default; verify it).
5. **Contrast (WCAG 2.1 AA).**
   - Amber `#EB9E16` is for fills only, never text on light backgrounds (2.4:1, fails).
   - Amber-coloured text on white or cream uses `--amber-text #8F5A00` (5.5:1).
   - Text on amber is always navy.
6. **Page weight:** under 1.5 MB on first load for any page at 375px, measured on the built output. Lighthouse mobile scores: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100.
7. **No** autoplay video, carousels that auto-advance, emoji icons, script fonts outside the logo, gradient washes other than the two defined in tokens, or left-border accent cards.
8. Every interactive element is a real `<a>`, `<button>`, `<input>` or `<label>`. Tap targets are ≥ 44×44px. Focus is visible: a 3px amber outline with 2px offset.

---

## 3. Design tokens

Copy `design/tokens.css` into `src/styles/tokens.css` and import it once in the base layout. Summary:

| Token | Value | Use |
|---|---|---|
| `--navy` | `#010E2B` | Header, footer, dark bands, headings, body text |
| `--amber` | `#EB9E16` | Primary button fill, icon discs (hero programme icon), 3px rules |
| `--gold` | `#F6D569` | Eyebrows and accents **on navy**, sunrise gradient |
| `--cream` | `#FCFAE5` | Alternating section background, form panels |
| `--brown` | `#3F392F` | Secondary text |
| `--amber-text` | `#8F5A00` | Eyebrow text on light backgrounds, checklist ticks |
| `--line` | `#E7E1C8` | Card borders, dividers |

**Type**

- Headings and pull-quotes use Fraunces 600. Body and UI use Source Sans 3.
- Eyebrows: 14px, weight 700, uppercase, letter-spacing 0.16em.
- Sizes are in tokens. On mobile (<480px), H2 is 28px, H1 is 34px and body is 17px.

**Layout**

- Container: max 1200px with 24px side padding (16px under 480px).
- Section vertical padding: 96px (56–64px on mobile).
- Grids use `repeat(auto-fit, minmax(Npx, 1fr))` so they collapse without breakpoints:

| Grid | Min column width |
|---|---|
| Cards | 300px |
| Two-column splits | 320–340px |
| Partner "ways" | 210px |

**Section background rhythm**, as in the comps: navy header → hero (navy + photo) → cream → white → navy band → white → cream → … → sunrise CTA → navy footer. Never put two of the same background next to each other unless a divider separates them.

---

## 4. Sitemap and routes

| Route | Source | Status |
|---|---|---|
| `/` | `reference/index.html`, `home-mobile.html` | Designed |
| `/about` | `reference/about.html` | Designed |
| `/what-we-do` | §6.3 below | **Not designed**: build from spec |
| `/what-we-do/[slug]` ×6 | `reference/programme.html` + `content/programmes.json` | Template designed |
| `/impact` | §6.5 below | **Not designed**: build from spec |
| `/team` | §6.6 below | **Not designed**: build from spec |
| `/partner` | `reference/partner.html` | Designed |
| `/contact` | `reference/contact.html` | Designed |
| `/safeguarding`, `/privacy` | Generic text-page layout | Text TBD (placeholder body + "Policy coming soon") |
| `/news`, `/news/[slug]` | Phase 2 | Scaffold the collection and route, then hide the route from nav |
| `/donate` | Phase 2 | Do not build. No route. |
| `/404` | Simple on-brand page linking Home and Contact | Build |

Programme slugs: `bible-translation-literacy`, `trauma-healing-peacebuilding`, `church-leadership`, `girls-empowerment`, `wash`, `women-livelihoods`.

---

## 5. Components (build these first, in this order)

Each one lives in `src/components/`. The visual spec comes from the named reference file.

1. **`SiteHeader`** (`index.html` desktop, `home-mobile.html` mobile)
   - **Desktop (≥ 1024px):**
     - Layout: logo on the left, nav in the middle, amber "Partner With Us" button on the right.
     - Nav items: About · What We Do ▾ · Impact · Team · Partner With Us · Contact.
     - Background navy. Links are cream, 16px, weight 600. The current page gets `aria-current="page"` and gold text.
   - **What We Do ▾ mega-menu:**
     - Content: the six programmes, each with its icon and the one-liner from `programmes.json`, in a 3×2 grid.
     - Panel: cream, max-width 960px.
     - Opens on click, not just hover.
     - `<button aria-expanded aria-controls>`. Esc closes it and focus returns to the trigger.
     - Without JS it degrades to a plain link to `/what-we-do`.
     - **Not in the comps — design it to match the card style.**
   - **Mobile (< 1024px):**
     - Bar: logo, then the compact "Partner" amber button, then a hamburger.
     - Hamburger is a 44×44 `<button aria-label="Open menu" aria-expanded>`.
     - It opens a full-height navy drawer: nav links stacked, programmes as a nested list, CTA at the bottom.
     - Lock body scroll while open. Trap focus. Esc closes.
     - **Important:** the desktop header must NOT simply wrap at mobile widths. Wrapping is what the fluid desktop comp does at 375px, and it is wrong. Use the `home-mobile.html` pattern.
   - Add a skip link ("Skip to content") as the first focusable element.
2. **`Logo`**
   - Stand-in SVG: circle, sunrise and rays, plus the wordmark "Relief" (Fraunces italic) over "SOUTH SUDAN" (12px, letter-spacing 0.18em, gold).
   - Make it one component so the real vector logo can replace it in one place.
   - **⚠ The final logo is pending from the client.** Put a TODO comment at the top of the file.
3. **`SiteFooter`** (full version in `index.html`)
   - Four auto-fit columns:
     - Brand: tagline "Bringing Hope · Sharing the Love · Transforming Lives", description, "Registered with the RRC, Eastern Equatoria · Reg. No. 95".
     - Quick links.
     - Programmes.
     - Contact.
   - Bottom bar: © year (computed), Safeguarding, Privacy.
   - **Use the full footer on every page.** Inner-page comps show a short bar only to save canvas space.
4. **`Button`** with `variant: primary | secondary | secondary-on-dark | text`, rendered as `<a>` or `<button>`.

   | Variant | Spec |
   |---|---|
   | primary | amber fill, navy text, 700, padding 15px 28px, radius 6px |
   | secondary | 2px navy border, navy text, padding 13px 26px |
   | secondary-on-dark | 2px cream border, cream text |
   | text | bold, with a trailing → |

   Hover: primary darkens to `#D48A0A`; secondary fills navy with cream text.
5. **`Eyebrow`**, **`SectionHeading`** (eyebrow + H2 + optional intro).
6. **`Hero`**
   - Variant `home`: full-bleed photo, `--hero-scrim` on desktop, `--hero-scrim-mobile` stacked on mobile.
   - Variant `page`: About style, shorter banner, max 40vh, on photo.
   - Variant `plain`: cream, headline + intro (Partner, Contact).
   - Photo is an `<Picture>`, eager-loaded, `fetchpriority="high"`.
7. **`ProgrammeCard`**
   - Content: 52px icon disc (`--icon-disc` background, navy 1.7px stroke icon), Fraunces H3 22px, one-liner, "Learn more →".
   - Border `--line`, radius 10px, padding 32px.
   - The whole card is the link.
   - Grid: 3×2 at desktop.
   - **Mobile:** horizontal scroll-snap row, cards 260px wide, with the hint "Swipe to see all six programmes". No JS.
8. **`Icon`**: one inline-SVG sprite or component.
   - Programme icons: book, heart, people, shield, drop, sprout.
   - Partner icons: funding, technical, strategic, prayer, resources.
   - UI icons: pin, mail, phone, clock, check, chevron, menu, close.
   - Stroke icons only. Copy the paths from the reference HTML.
   - Decorative icons get `aria-hidden="true"`.
9. **`VisionBand`**: navy band with a 64×3 amber rule, gold eyebrow and a Fraunces statement. Reused for programme pull-quotes as `<figure><blockquote>`.
10. **`StatCounters`**: four stats, each with a 3px amber top rule and a big Fraunces number.
    - Renders only if `site.impact.published === true` **and** every value is a real number.
    - No count-up animation (no JS).
11. **`PillarList`**: the six approach pillars.
    - Home: 2-column compact version.
    - About: table-like rows with a 170px label column.
12. **`ValueTile`**: number (01–06, `--amber-text`), H3, text.
13. **`StoryCard` / `FeaturedStory`**: driven by the news/stories collection. Hidden if there are no published, consented items. Add a `consent: true` field to the schema; do not render items without it.
14. **`PartnerLogoStrip`** and **`PartnerCard`**
    - Driven by the partners collection: `name`, `url`, `logo`, `blurb`, `permission: boolean`.
    - Only render partners with `permission: true`.
    - Logos are greyscale and go to colour on hover/focus.
    - External links use `rel="noopener"`.
15. **`CTABand`**
    - `sunrise`: closing CTA, centred.
    - `sunrise-inline`: programme page, text left and button right.
    - `navy`: About page.
16. **`ChecklistGrid`**: programme activities as a 2-column `<ul>` with amber-text ticks and bottom dividers.
17. **`Breadcrumb`**: `<nav aria-label="Breadcrumb">` with an `<ol>`, plus BreadcrumbList JSON-LD.
18. **`Form`** primitives: `Field` (label wraps input, 48px height, `--input-border`, radius 6px), `CheckboxGroup` (fieldset + legend), `ConsentCheckbox` (required), honeypot, and success and error states.
    - On success: an inline confirmation message in an `aria-live="polite"` region.
19. **`PhotoPlaceholder`**: used wherever an image is missing.
    - In dev it renders the hatched block with its label.
    - In production it renders a neutral cream block with the logo sunrise motif, and **no label text**.
20. **`MapEmbed`**: static image first, then a "Load interactive map" `<button>` that injects the iframe. No map JS or iframe on initial load.

---

## 6. Page specs

The reference HTML has exact section order and copy for designed pages. Notes below cover only what the comps don't show.

### 6.1 Home (`/`)

Sections, in order:

1. Hero
2. Who we are
3. What we do (6 cards)
4. Vision band
5. Impact stats (**hidden by default**)
6. Our approach
7. Featured story (**hidden by default**)
8. Partners strip (**only partners with permission**; hide the whole strip if none)
9. Closing sunrise CTA
10. Footer

SEO title: `Relief South Sudan | Faith-Based Relief & Community Development in South Sudan`.

### 6.2 About (`/about`)

Sections, in order:

1. Hero, page variant (photo P6)
2. Who we are (two-column: heading left, 3 paragraphs right)
3. Our story
4. Vision/Mission cards (navy and cream)
5. Core values (6 tiles)
6. Our approach (rows)
7. Accountability & registration (text + `<dl>` panel)
8. Navy CTA band

Our story is a timeline driven by `src/content/site/timeline.json`. Only the 2026 RRC registration entry is real. **Hide the section until there are ≥ 2 real entries.**

Accountability links:

| Link | Target |
|---|---|
| "View registration certificate (PDF)" | `/docs/rrc-certificate.pdf`. **TODO**: the client must supply a clean scan. Hide the link if the file is missing. |
| Safeguarding | `/safeguarding` |
| Annual report | Hidden until it exists |

### 6.3 What We Do hub (`/what-we-do`), not designed

- **Header:** plain hero.
  - Headline: "Holistic ministry. Practical action. Lasting change."
  - Intro: "Our programmes respond to the interconnected spiritual, social, educational, economic and humanitarian needs of vulnerable communities."
- **Body:** six alternating image/text rows (image left/right alternating, stacking on mobile). Each row has the icon disc, H2 title, tagline, the `need` sentence and "Learn more →".
- **End:** sunrise CTA band.

### 6.4 Programme template (`/what-we-do/[slug]`)

- **Source:** generate from `content/programmes.json`.
- **Layout:** match `reference/programme.html` exactly.
  - Cream hero: breadcrumb, amber icon disc (60px), H1, tagline, two CTAs, image.
  - The need / Our response: two columns. Need is in Fraunces 28px.
  - What we do: ChecklistGrid.
  - Navy quote band.
  - From the field: hidden until news items are tagged with this programme.
  - Related programmes: 2 cards from `related`.
  - Sunrise-inline CTA band.
- **Image rules:** where `image` is null, use `PhotoPlaceholder`. Honour `imageRule`.
- **Title:** use `shortTitle` for cards and nav, and `title` for the H1.

### 6.5 Impact (`/impact`), not designed

Build from these patterns:

1. **Hero:** page variant, photo P6.
   - Headline: "Serving communities across South Sudan."
   - Intro: "Relief South Sudan has a national outlook, with particular attention to underserved, rural, marginalised and hard-to-reach areas. Our work is guided by local needs, community participation and opportunities for sustainable impact."
2. **Where we work:**
   - Text (left): "South Sudan’s geographical, cultural and linguistic diversity presents unique challenges and opportunities. From our base in Torit, Eastern Equatoria, we work with local communities and partners to develop approaches that respond to the realities of each context."
   - Map (right): an inline SVG of South Sudan's outline with a Torit pin.
     - Draw it from a public-domain or Natural Earth outline and simplify it. **No ethnic-group map.**
     - Highlighted areas are driven by `src/content/site/locations.json` (empty for now, so show only the Torit pin).
3. **Who we serve:** icon grid of 11 groups:
   - Unreached and underserved language communities
   - Women and girls
   - Children and youth
   - Pastors and church leaders
   - Internally displaced persons (IDPs)
   - Refugees and returnees
   - Conflict-affected communities
   - Survivors of violence
   - Rural and marginalised communities
   - Vulnerable households
   - Communities with limited access to essential services

   Each is a simple icon plus label, 4 columns down to 2.
4. **Impact in numbers:** StatCounters. Hidden by default.
5. **Recent activities gallery:** P1–P7 in a CSS grid.
   - Lightbox uses the native `<dialog>` with a few lines of vanilla JS: arrow keys, Esc, focus return.
   - Captions come from `src/content/gallery.json`. Leave captions as TODO.
   - **⚠ Photo consent is unconfirmed.** Gate the gallery behind `gallery.published` (default false).
6. **Stories of change:** 2–3 StoryCards, hidden by default.
7. **CTA:** "Help us reach more communities." with a Partner With Us button.

### 6.6 Team (`/team`), not designed

- **Header:** plain hero.
  - Headline: "Local leaders serving local communities."
  - Intro: "Our team is made up of South Sudanese leaders, staff and volunteers committed to serving with compassion, integrity, professionalism and accountability."
- **Groups:** Leadership, Board, Programme staff (optional), Volunteers (optional).
  - Driven by the `team` collection: `name`, `role`, `group`, `bio` (40–60 words), `photo?`, `email?`, `linkedin?`, `order`.
- **Cards:** square portrait, or an initials avatar (navy disc, gold initials) when there is no photo. Name in Fraunces 20px, role, bio.
  - 4 columns down to 2 on mobile.
  - Bio is always visible. Don't hide it behind hover; touch users can't hover.
- **"Join our team" band:** "We welcome volunteers and professionals who share our values" → `/contact?subject=volunteer`.
- **⚠ No team data exists.** Ship the page with the collection empty. The page then shows only the header and the Join band, and is **removed from nav** until `team.length > 0`.

### 6.7 Partner (`/partner`)

- **Partnership cards:** 5 cards, with anchors `#funding`, `#technical`, `#strategic`, `#prayer`, `#resources`. "Pray With Us" links elsewhere target `/partner#prayer`.
- **Who we work with:** pill list.
- **Our partners:** cards from the partners collection, `permission: true` only.
- **Enquiry form:**
  - Fields: Name\*, Organisation, Email\*, Country, Partnership interest (checkbox group of the five), Message\*, Consent\* + honeypot.
  - Pre-check an interest from the query string, e.g. `?interest=prayer`.
  - The header CTA on this page reads "Start a Conversation" and scrolls to `#enquiry`.
- **"Download our profile (PDF)":** links to `/docs/rss-profile.pdf`. Hide it until the file exists.

### 6.8 Contact (`/contact`)

- **Details card (navy):**
  - Address: Domus Erum Residence, Torit, Eastern Equatoria State, South Sudan.
  - Email: `mailto:reliefsouthsudan@gmail.com`.
  - Phone: `tel:+211922288315`.
  - **Second number (+257 6828 5966) is NOT shown** until the client confirms it.
  - WhatsApp link only if confirmed.
  - Office hours and socials: render only if present in `site.json`.
- **Map:** MapEmbed (static first).
- **Form:**
  - Fields: Name\*, Email\*, Phone, Subject (General / Partnership / Volunteer / Media / Prayer), Message\*, Consent\*, honeypot.
  - Pre-select the subject from `?subject=`.

### 6.9 Safeguarding and Privacy

Generic prose layout: max-width 720px, cream hero. The body is a Markdown file with a placeholder line and a clear `TODO: client to supply policy text`. **Keep both pages linked in the footer at launch.**

---

## 7. Site data (`src/content/site/site.json`)

```json
{
  "name": "Relief South Sudan",
  "shortName": "RSS",
  "tagline": "Bringing Hope · Sharing the Love · Transforming Lives",
  "heroLine": "Demonstrating the love of Christ through compassionate service.",
  "valuesLine": "Faith. Compassion. Dignity. Hope. Transformation.",
  "address": { "line1": "Domus Erum Residence", "locality": "Torit", "region": "Eastern Equatoria State", "country": "South Sudan" },
  "email": "reliefsouthsudan@gmail.com",
  "phones": [{ "display": "+211 922 288 315", "tel": "+211922288315", "whatsapp": null }],
  "officeHours": null,
  "social": {},
  "registration": { "body": "Relief and Rehabilitation Commission (RRC), Eastern Equatoria State – Torit", "number": "95", "act": "South Sudan NGO Act 2016, Chapter 3, Section 10", "validUntil": "2027-10-01" },
  "impact": { "published": false, "stats": [] },
  "gallery": { "published": false }
}
```

Add a build-time warning (not an error) when `registration.validUntil` is within 60 days.

Wording rule: say "registered in Eastern Equatoria, serving communities across South Sudan". **Never** write "nationally registered".

---

## 8. SEO and metadata

- **Base layout props:** `title` (≤ 60 chars), `description` (≤ 155 chars), `canonical`, `ogImage`.
  - Default OG image: 1200×630, navy with the logo and tagline. Generate it at build time or as a static PNG.
- **Titles:**

  | Page | Title |
  |---|---|
  | Home | Relief South Sudan \| Faith-Based Relief & Community Development in South Sudan |
  | About | About Us \| Relief South Sudan |
  | What We Do | What We Do \| Relief South Sudan Programmes |
  | Programmes | `seoTitle` from the JSON |
  | Impact | Where We Work & Our Impact \| Relief South Sudan |
  | Team | Our Team \| Relief South Sudan Leadership |
  | Partner | Partner With Us \| Support Relief South Sudan |
  | Contact | Contact Us \| Relief South Sudan, Torit |

- **Descriptions:** write them from each page's intro copy. Do not invent claims.
- **JSON-LD:** `NGO` on every page (name, url, logo, email, telephone, address in Torit, `sameAs` from social). Programme pages also get `BreadcrumbList`. News gets `Article` (Phase 2).
- **Crawl files:** `@astrojs/sitemap`, plus a `robots.txt` that allows everything except `/admin`.
- **Headings:** one H1 per page, the headline from the spec. Heading levels must not skip.
- **Alt text:** describe the activity, never name vulnerable people. Example: "Church leaders in a small-group discussion during a workshop in Torit".
- **Analytics:** a Plausible snippet behind an env var (`PLAUSIBLE_DOMAIN`). It does not load if the variable is unset.

---

## 9. Images and assets

- Photos P1–P7 are WhatsApp-compressed, 1600×686, and **not in this package**. The client will provide them. Put them in `src/assets/photos/p1.jpg` … `p7.jpg`.
- Until the files exist, `PhotoPlaceholder` renders. Code must not crash if a file is missing; use a glob import with fallback.
- Placement:

  | Photo | Placement |
  |---|---|
  | P1 | Church Leadership |
  | P2 | Home approach |
  | P3 | Home "who we are" |
  | P4 | Home hero (fallback), Trauma |
  | P5 | Bible Translation |
  | P6 | About and Impact banners, Church Leadership |
  | P7 | Contact side image, Partner |

- **P3 shows a T-shirt reading "…ans Theological … School International". ⚠ Do not use P3 until the client clears it.** Use P1 in its place.
- **Do NOT use** the profile's ethnic-groups map or the watermarked flag image, ever.
- Favicon: a navy square with the amber sunrise from the Logo component. SVG plus a 32px PNG and a 180px apple-touch icon.

---

## 10. Build order (do it in this sequence and commit after each)

1. Scaffold Astro, tokens, fonts, base layout, header/footer (with mobile drawer), Logo, Button and Icon.
2. Home at full fidelity against `screenshots/index-1440.png` and `screenshots/home-mobile-375.png`.
3. Programme template plus all 6 pages from JSON. Check one against `programme-1440.png`.
4. About, Partner, Contact (against their screenshots), then forms with honeypot and success state.
5. What We Do hub, Impact, Team (from spec, using existing components only).
6. Safeguarding, Privacy, 404, sitemap, robots, JSON-LD, OG image.
7. Decap CMS config for the programmes, team, partners, news, gallery and site collections.
8. Performance pass, then accessibility pass, then the acceptance checklist below.

## 11. Acceptance checklist (run before saying "done")

- [ ] `npm run build` passes with zero warnings except the registration-expiry warning.
- [ ] Visual check: screenshot every designed page at 1440 and 375 with Playwright. Compare against `screenshots/` side by side. Section order, backgrounds, type sizes and spacing match within reason.
- [ ] At 360px, nothing scrolls horizontally on any page, apart from the programme card swipe row, which is intended.
- [ ] Mobile header uses the hamburger drawer. Esc and focus trap work. Mega-menu works by keyboard.
- [ ] Lighthouse mobile scores on Home, a Programme page and Contact: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100.
- [ ] axe-core reports 0 violations on every page (`@axe-core/playwright`).
- [ ] Built Home is under 1.5 MB at 375px with images.
- [ ] No "pending" pills, `[#]` or `[Placeholder]` text is visible in the production build. Grep `dist/` for `[` placeholders and flagged strings.
- [ ] Hidden-by-default sections are absent from the HTML, not just visually hidden: impact stats, stories, field updates, gallery, team (and its nav link), timeline, partners without permission, second phone number.
- [ ] The second phone number does not appear anywhere in `dist/`.
- [ ] Forms submit and show success, the honeypot blocks bots, and a required consent box is enforced.
- [ ] All 6 programme pages render, related links resolve and breadcrumb JSON-LD is valid.
- [ ] No EXIF/GPS data in output images (`exiftool dist/**/*.{jpg,webp,avif}`).
- [ ] British spellings: grep for "organization", "program " and "center" returns nothing in content.

## 12. Open items for the client (do not block on these; build placeholders)

1. Vector logo
2. Team names, bios and photos
3. Confirm the second phone number and WhatsApp
4. Domain: reliefsouthsudan.info was unreachable, so confirm DNS and hosting
5. A professional email on the domain
6. Photo consent and captions for P1–P7, plus clearance for P3
7. Hero photography and photos for each programme (WASH, girls, women)
8. Founding story and milestones
9. Impact figures
10. Operating locations
11. Consented stories
12. Partner logos, permission and blurbs
13. Donation route (Phase 2)
14. Safeguarding and privacy policy text
15. Social accounts
16. Office hours and an exact map pin
17. Annual report
18. Clean certificate scan

When you finish, write `BUILD-NOTES.md` covering:

- What was built
- How to run it
- How to edit content (CMS and files)
- Deviations from this spec, each with a reason
- Which open items are still placeholders
