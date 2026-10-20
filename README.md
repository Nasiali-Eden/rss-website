# Relief South Sudan — website

Public website for Relief South Sudan, a South Sudanese, community-based Christian non-profit based in Torit, Eastern Equatoria.

Vite + React, prerendered to static HTML.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

Deployed on Vercel (`vercel.json`): import the repo in Vercel and every push to `main` deploys. Build settings are picked up automatically.

Content lives in `src/content/*.json` (or edit via `/admin` once CMS auth is set up). Photos go in `src/assets/photos/` as `p1.jpg`, `p2.jpg`, …

See [BUILD-NOTES.md](BUILD-NOTES.md) for full details, and `design-reference/` for the approved designs and handoff.
