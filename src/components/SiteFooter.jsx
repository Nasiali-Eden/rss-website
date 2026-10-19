import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { site, programmes, shortTitle, showTeam } from '../lib/content.js';

const SOCIAL_LABELS = { facebook: 'Facebook', whatsapp: 'WhatsApp', linkedin: 'LinkedIn', youtube: 'YouTube', x: 'X', instagram: 'Instagram' };

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const social = Object.entries(site.social || {}).filter(([, url]) => url);
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo size="footer" />
          <p className="site-footer__tagline">{site.tagline}</p>
          <p>
            A South Sudanese, community-based Christian organisation. Registered with the RRC, Eastern Equatoria · Reg. No.{' '}
            {site.registration.number}.
          </p>
        </div>
        <nav aria-label="Quick links">
          <h2 className="site-footer__h">Quick links</h2>
          <ul role="list">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/what-we-do">What We Do</Link></li>
            <li><Link to="/impact">Impact</Link></li>
            {showTeam && <li><Link to="/team">Team</Link></li>}
            <li><Link to="/partner">Partner With Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Programmes">
          <h2 className="site-footer__h">Programmes</h2>
          <ul role="list">
            {programmes.map((p) => (
              <li key={p.slug}><Link to={`/what-we-do/${p.slug}`}>{shortTitle(p)}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__h">Contact</h2>
          <ul role="list">
            <li>{site.address.line1}, {site.address.locality}, Eastern Equatoria, {site.address.country}</li>
            <li><a href={`mailto:${site.email}`} className="site-footer__email">{site.email}</a></li>
            {site.phones.map((ph) => (
              <li key={ph.tel}><a href={`tel:${ph.tel}`}>{ph.display}</a></li>
            ))}
            {social.length > 0 && (
              <li className="site-footer__social">
                {social.map(([k, url]) => (
                  <a key={k} href={url} rel="noopener" target="_blank">{SOCIAL_LABELS[k] || k}</a>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {year} {site.name}</span>
        <span className="site-footer__legal">
          <Link to="/safeguarding">Safeguarding</Link>
          <Link to="/privacy">Privacy</Link>
        </span>
      </div>
    </footer>
  );
}
