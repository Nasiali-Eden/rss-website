import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section } from '../components/Section.jsx';
import { CTABand } from '../components/Bands.jsx';
import { team } from '../lib/content.js';

const INTRO = 'Our team is made up of South Sudanese leaders, staff and volunteers committed to serving with compassion, integrity, professionalism and accountability.';
const GROUPS = ['Leadership', 'Board', 'Programme staff', 'Volunteers'];
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

function TeamCard({ m }) {
  return (
    <article className="team-card">
      {m.photo ? (
        <img src={m.photo} alt={`Portrait of ${m.name}`} className="team-card__photo" loading="lazy" width="400" height="400" />
      ) : (
        <span className="team-card__avatar" aria-hidden="true">{initials(m.name)}</span>
      )}
      <h3>{m.name}</h3>
      <p className="team-card__role">{m.role}</p>
      {m.bio && <p className="team-card__bio">{m.bio}</p>}
      {(m.email || m.linkedin) && (
        <p className="team-card__links">
          {m.email && <a href={`mailto:${m.email}`}>Email</a>}
          {m.linkedin && <a href={m.linkedin} rel="noopener" target="_blank">LinkedIn</a>}
        </p>
      )}
    </article>
  );
}

export default function Team() {
  const groups = GROUPS.map((g) => ({ g, members: team.filter((m) => m.group === g) })).filter((x) => x.members.length);
  return (
    <>
      <Seo path="/team" title="Our Team | Relief South Sudan Leadership" description={INTRO} />
      <Hero variant="plain" eyebrow="Our team" title="Local leaders serving local communities." intro={INTRO} />
      {groups.map(({ g, members }, i) => (
        <Section key={g} bg={i % 2 ? 'cream' : 'white'} inner="stack-lg">
          <h2 className="h2--md">{g}</h2>
          <div className="team-grid">{members.map((m) => <TeamCard key={m.name} m={m} />)}</div>
        </Section>
      ))}
      <CTABand
        variant="navy"
        title="Join our team"
        text="We welcome volunteers and professionals who share our values."
        actions={[{ href: '/contact?subject=volunteer', label: 'Get in Touch', variant: 'primary' }]}
      />
    </>
  );
}
