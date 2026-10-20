import site from '../content/site.json';
import programmesFile from '../content/programmes.json';
import partnersFile from '../content/partners.json';
import teamFile from '../content/team.json';
import newsFile from '../content/news.json';
import timelineFile from '../content/timeline.json';
import locationsFile from '../content/locations.json';
import galleryFile from '../content/gallery.json';
import governanceFile from '../content/governance.json';
// Each content file is an object with one list (Decap CMS needs an object at the top level).
const programmes = programmesFile.programmes;
const partnersAll = partnersFile.partners || [];
const teamAll = teamFile.team || [];
const newsAll = newsFile.news || [];
const timelineAll = timelineFile.timeline || [];
const locations = locationsFile.locations || [];
const gallery = galleryFile.gallery || [];
import pages from '../content/pages.json';

export { site, programmes, locations, gallery, pages };

/** Only partners who gave permission are ever rendered. */
export const partners = partnersAll.filter((p) => p.permission === true);

/** Team, sorted. The Team page and nav link only appear when this is non-empty. */
export const team = [...teamAll].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
export const showTeam = team.length > 0;

/** Governance page: Board Chair, Board Members and Director, sorted. */
export const governance = [...(governanceFile.members || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

/** Stories / field updates: published AND consented only. */
export const news = newsAll.filter((n) => n.published === true && n.consent === true);
export const stories = news.filter((n) => n.featured === true);

/** Timeline shows only when there are at least two real entries. */
export const timeline = timelineAll.filter((t) => t.real === true);
export const showTimeline = timeline.length >= 2;

/** Impact stats render only if published and every value is a real number. */
export const showImpact =
  site.impact?.published === true &&
  site.impact.stats.length > 0 &&
  site.impact.stats.every((s) => typeof s.value === 'number' && Number.isFinite(s.value));

export const programmeBySlug = Object.fromEntries(programmes.map((p) => [p.slug, p]));
export const shortTitle = (p) => p.shortTitle || p.title;
export const cardLine = (p) => p.cardLine || p.tagline;

/** Files uploaded to public/ (e.g. "/uploads/x.jpg") need the base path when the site runs at a sub-path. */
export const assetUrl = (src) => (src?.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + src : src);

export const fullAddress = [site.address.line1, site.address.locality, site.address.region, site.address.country].join(', ');
