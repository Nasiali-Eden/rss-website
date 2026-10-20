import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { shortTitle, cardLine, assetUrl } from '../lib/content.js';

export function IconDisc({ name, size = 52, amber = false }) {
  return (
    <span className={`icon-disc${amber ? ' icon-disc--amber' : ''}`} style={{ width: size, height: size }}>
      <Icon name={name} size={Math.round(size / 2)} />
    </span>
  );
}

export function ProgrammeCard({ p, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <Link to={`/what-we-do/${p.slug}`} className="card programme-card">
      <IconDisc name={p.icon} />
      <H className="programme-card__title">{shortTitle(p)}</H>
      <p className="programme-card__line">{cardLine(p)}</p>
      <span className="programme-card__more">Learn more <span aria-hidden="true">→</span></span>
    </Link>
  );
}

/** Desktop 3×2 grid; on mobile a horizontal scroll-snap row (no JS). */
export function ProgrammeGrid({ items }) {
  return (
    <>
      <p className="swipe-hint">Swipe to see all six programmes</p>
      <ul className="programme-grid" role="list">
        {items.map((p) => (
          <li key={p.slug}><ProgrammeCard p={p} /></li>
        ))}
      </ul>
    </>
  );
}

export function RelatedCard({ p }) {
  return (
    <Link to={`/what-we-do/${p.slug}`} className="card related-card">
      <h3>{shortTitle(p)}</h3>
      <p>{cardLine(p)}</p>
      <span className="programme-card__more">Learn more <span aria-hidden="true">→</span></span>
    </Link>
  );
}

export function ValueTile({ n, title, text }) {
  return (
    <div className="card value-tile">
      <span className="value-tile__n">{String(n).padStart(2, '0')}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export function ChecklistGrid({ items }) {
  return (
    <ul className="checklist" role="list">
      {items.map((t) => (
        <li key={t}><Icon name="check" size={22} strokeWidth={2.2} className="checklist__tick" />{t}</li>
      ))}
    </ul>
  );
}

/** compact (Home, 2 columns) or rows (About, 170px label column). */
export function PillarList({ items, variant = 'compact' }) {
  return (
    <dl className={`pillars pillars--${variant}`}>
      {items.map((p) => (
        <div key={p.label} className="pillars__item">
          <dt>{p.label}</dt>
          <dd>{variant === 'compact' ? p.short : p.long}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StatCounters({ stats }) {
  return (
    <ul className="stats" role="list">
      {stats.map((s) => (
        <li key={s.label}>
          <span className="stats__n">{s.value.toLocaleString('en-GB')}{s.suffix || ''}</span>
          <span className="stats__label">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function StoryCard({ item }) {
  return (
    <article className="card story-card">
      <div className="story-card__body">
        <p className="story-card__meta">{[item.date, item.place].filter(Boolean).join(' · ')}</p>
        <h3>{item.title}</h3>
        {item.summary && <p>{item.summary}</p>}
      </div>
    </article>
  );
}

/** Links out when the partner has a website; otherwise a plain card. */
function PartnerLink({ p, className, children }) {
  if (!p.url) return <div className={className}>{children}</div>;
  return <a href={p.url} rel="noopener" target="_blank" className={className}>{children}</a>;
}

export function PartnerCard({ p }) {
  return (
    <PartnerLink p={p} className="card partner-card">
      {p.logo && <span className="partner-card__logo"><img src={assetUrl(p.logo)} alt="" loading="lazy" /></span>}
      <strong>{p.name}</strong>
      {p.blurb && <span>{p.blurb}</span>}
    </PartnerLink>
  );
}

export function PartnerLogoStrip({ items }) {
  return (
    <ul className="partner-strip" role="list">
      {items.map((p) => (
        <li key={p.name}>
          <PartnerLink p={p} className="partner-strip__item">
            {p.logo ? <img src={assetUrl(p.logo)} alt={p.name} className="partner-logo" loading="lazy" /> : <span>{p.name}</span>}
          </PartnerLink>
        </li>
      ))}
    </ul>
  );
}
