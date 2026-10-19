import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section, SectionHeading, Eyebrow } from '../components/Section.jsx';
import { ValueTile, PillarList } from '../components/Cards.jsx';
import { CTABand } from '../components/Bands.jsx';
import { Link } from 'react-router-dom';
import { site, pages, timeline, showTimeline, showTeam } from '../lib/content.js';

export default function About() {
  const docs = site.documents || {};
  return (
    <>
      <Seo
        path="/about"
        title="About Us | Relief South Sudan"
        description="Relief South Sudan is a South Sudanese, community-based Christian non-profit serving vulnerable communities through holistic ministry and community development."
      />
      <Hero
        variant="page"
        eyebrow="About us"
        title={site.valuesLine}
        intro="Relief South Sudan (RSS) is a South Sudanese community-based, non-profit and Christian organisation committed to serving vulnerable and underserved communities through holistic ministry, humanitarian assistance and sustainable community development."
        photo="P6"
        photoLabel="Photo P6 — large gathering (banner, max 40vh)"
        photoAlt="A large community gathering"
      />

      <Section bg="white" inner="split split--top">
        <SectionHeading eyebrow="Who we are" title="Lasting transformation touches the whole person." />
        <div className="prose-stack">
          <p>
            We believe that lasting transformation happens when people are supported spiritually, socially, emotionally, educationally and
            economically. Through our programmes, we combine Christian ministry with practical interventions that promote dignity, hope,
            resilience and sustainable development.
          </p>
          <p>
            Our work focuses on reaching underserved and unreached communities, strengthening local leadership, empowering women and girls,
            improving access to essential services, promoting peace and healing, and making God’s Word accessible to every language community.
          </p>
          <p>
            We work alongside churches, communities, government institutions, national and international organisations, faith-based
            organisations and development partners to create meaningful and lasting impact across South Sudan.
          </p>
        </div>
      </Section>

      {showTimeline && (
        <Section bg="cream" inner="stack-lg">
          <h2 className="h2--md">Our story</h2>
          <ol className="timeline" role="list">
            {timeline.map((t) => (
              <li key={t.year + t.text}>
                <span className="timeline__year">{t.year}</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <Section bg={showTimeline ? 'white' : 'cream'} inner="vm-grid">
        <div className="vm vm--navy">
          <Eyebrow onDark as="h2">Vision</Eyebrow>
          <p>To transform communities across South Sudan where people have access to God’s Word and opportunities to live with dignity, hope, peace and sustainable development.</p>
        </div>
        <div className="vm vm--cream">
          <Eyebrow as="h2">Mission</Eyebrow>
          <p>To reach underserved and unreached communities by combining Bible translation, literacy, humanitarian assistance, leadership development and community empowerment, demonstrating the love of Christ through compassionate service.</p>
        </div>
      </Section>

      <Section bg="white" inner="stack-lg">
        <h2 className="h2--md">Our core values</h2>
        <div className="grid grid--cards">
          {pages.values.map((v, i) => (
            <ValueTile key={v.title} n={i + 1} title={v.title} text={v.text} />
          ))}
        </div>
      </Section>

      <Section bg="cream" inner="stack-lg">
        <h2 className="h2--md">Our approach</h2>
        <PillarList items={pages.pillars} variant="rows" />
      </Section>

      <Section bg="white" inner="split split--top">
        <div className="stack">
          <Eyebrow as="h2">Accountability &amp; registration</Eyebrow>
          <p>
            Relief South Sudan is registered with the Relief and Rehabilitation Commission (RRC), Eastern Equatoria State, as a local charitable
            organisation under Chapter 3, Section 10 of the South Sudan NGO Act 2016 (Registration No. {site.registration.number}). We are
            committed to serving communities with compassion, integrity, professionalism and accountability.
          </p>
          <p className="link-row">
            {docs.certificate && <a href={docs.certificate}>View registration certificate (PDF)</a>}
            <Link to="/safeguarding">Safeguarding Policy</Link>
            {docs.annualReport && <a href={docs.annualReport}>Annual report (PDF)</a>}
          </p>
        </div>
        <dl className="reg-panel">
          <div><dt>Registered with</dt><dd>RRC, Eastern Equatoria – Torit</dd></div>
          <div><dt>Registration No.</dt><dd>{site.registration.number}</dd></div>
          <div><dt>Under</dt><dd>NGO Act 2016, Ch. 3, Sec. 10</dd></div>
          <div><dt>Status</dt><dd>Local charitable organisation</dd></div>
        </dl>
      </Section>

      <CTABand
        variant="navy"
        title="Local leaders serving local communities."
        actions={[
          showTeam ? { href: '/team', label: 'Meet Our Team', variant: 'secondary-on-dark' } : { href: '/contact', label: 'Get in Touch', variant: 'secondary-on-dark' },
          { href: '/partner', label: 'Partner With Us', variant: 'primary' },
        ]}
      />
    </>
  );
}
