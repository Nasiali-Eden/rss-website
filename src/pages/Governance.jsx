import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section, SectionHeading, Eyebrow } from '../components/Section.jsx';
import { CTABand } from '../components/Bands.jsx';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { site, governance, assetUrl as asset } from '../lib/content.js';

const INTRO =
  'Relief South Sudan is overseen by a Board and led day to day by its Director, with integrity, transparency and accountability to the communities, partners and supporters we serve.';

const COMMITMENTS = [
  { title: 'Accountability & transparency', text: 'We practise responsible stewardship and openness with the communities, partners and supporters we serve.' },
  { title: 'Christian faith & biblical integrity', text: 'Christian faith and biblical principles guide our leadership, relationships and decisions.' },
  { title: 'Safeguarding', text: 'We are committed to the safety, dignity and wellbeing of every child, young person and adult we work with.' },
  { title: 'Community participation', text: 'Communities help identify needs, shape solutions and take ownership of lasting change.' },
];

const initials = (name) =>
  name.replace(/^(Rev|Dr|Mr|Mrs|Ms)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const inGroup = (g) => governance.filter((m) => m.group === g);

const SOCIAL = [
  ['linkedin', 'LinkedIn'],
  ['facebook', 'Facebook'],
  ['x', 'X'],
  ['instagram', 'Instagram'],
  ['website', 'Website'],
];

function FaceCard({ m }) {
  const links = SOCIAL.filter(([k]) => m.social?.[k]);
  return (
    <article className="face-card">
      {m.photo ? (
        <img src={asset(m.photo)} alt={`Portrait of ${m.name}`} className="face-card__photo" loading="lazy" width="480" height="560" />
      ) : (
        <span className="face-card__photo face-card__photo--empty" aria-hidden="true">{initials(m.name)}</span>
      )}
      <div className="face-card__body">
        <h3 className="face-card__name">{m.name}</h3>
        <p className="face-card__role">{m.role}</p>
        {m.bio && <p className="face-card__bio">{m.bio}</p>}
        {links.length > 0 && (
          <ul className="face-card__social" role="list">
            {links.map(([k, label]) => (
              <li key={k}>
                <a href={m.social[k]} target="_blank" rel="noopener" aria-label={`${m.name} on ${label}`}>
                  <Icon name={k === 'website' ? 'globe' : k} size={20} strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function Governance() {
  const docs = site.documents || {};
  // One row: Director first, then the Board Chair and Board Members.
  const people = [...inGroup('Director'), ...inGroup('Board Chair'), ...inGroup('Board Member')];
  return (
    <>
      <Seo path="/governance" title="Governance | Relief South Sudan" description={INTRO} />
      <Hero variant="plain" eyebrow="Governance" title="Accountable to the communities we serve." intro={INTRO} />

      <Section bg="white" inner="stack-lg">
        <SectionHeading eyebrow="Our structure" title="How we are governed" />
        <div className="face-row">{people.map((m) => <FaceCard key={m.name} m={m} />)}</div>
      </Section>

      <Section bg="cream" inner="split split--top">
        <div className="stack">
          <Eyebrow as="h2">Legal status &amp; registration</Eyebrow>
          <p>
            Relief South Sudan is registered with the {site.registration.body} as a local charitable organisation under the{' '}
            {site.registration.act} (Registration No. {site.registration.number}).
          </p>
          <p className="link-row">
            {docs.certificate && <a href={docs.certificate}>View registration certificate (PDF)</a>}
            {docs.annualReport && <a href={docs.annualReport}>Annual report (PDF)</a>}
            <Link to="/safeguarding">Safeguarding Policy</Link>
          </p>
        </div>
        <dl className="reg-panel">
          <div><dt>Registered with</dt><dd>RRC, Eastern Equatoria – Torit</dd></div>
          <div><dt>Registration No.</dt><dd>{site.registration.number}</dd></div>
          <div><dt>Under</dt><dd>NGO Act 2016, Ch. 3, Sec. 10</dd></div>
          <div><dt>Status</dt><dd>Local charitable organisation</dd></div>
        </dl>
      </Section>

      <Section bg="white" inner="stack-lg">
        <h2 className="h2--md">Our commitments</h2>
        <div className="grid grid--commitments">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="card commitment">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTABand
        variant="navy"
        title="Questions about how we work?"
        text="We welcome enquiries from partners, donors and communities."
        actions={[
          { href: '/contact', label: 'Get in Touch', variant: 'secondary-on-dark' },
          { href: '/partner', label: 'Partner With Us', variant: 'primary' },
        ]}
      />
    </>
  );
}
