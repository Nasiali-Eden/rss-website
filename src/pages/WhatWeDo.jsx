import { Link } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import Photo from '../components/Photo.jsx';
import { Section } from '../components/Section.jsx';
import { IconDisc } from '../components/Cards.jsx';
import { CTABand } from '../components/Bands.jsx';
import { programmes } from '../lib/content.js';

const INTRO = 'Our programmes respond to the interconnected spiritual, social, educational, economic and humanitarian needs of vulnerable communities.';

export default function WhatWeDo() {
  return (
    <>
      <Seo path="/what-we-do" title="What We Do | Relief South Sudan Programmes" description={INTRO} />
      <Hero variant="plain" eyebrow="What we do" title="Holistic ministry. Practical action. Lasting change." intro={INTRO} />
      {programmes.map((p, i) => (
        <Section key={p.slug} bg={i % 2 ? 'cream' : 'white'} inner={`split split--center hub-row${i % 2 ? ' hub-row--flip' : ''}`}>
          <Photo slot={p.image} className="media media--360" label={p.image ? `Photo ${p.image}` : p.imageRule} alt={p.imageAlt || ''} />
          <div className="stack">
            <IconDisc name={p.icon} />
            <h2 className="h2--md">{p.shortTitle || p.title}</h2>
            <p className="hub-row__tagline">{p.tagline}</p>
            <p>{p.need}</p>
            <Link to={`/what-we-do/${p.slug}`} className="btn btn--text">
              Learn more<span className="visually-hidden"> about {p.shortTitle || p.title}</span> <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Section>
      ))}
      <CTABand
        title="Together, we can make a difference."
        text="Join us through funding, expertise, prayer or partnership."
        actions={[
          { href: '/partner', label: 'Partner With Us', variant: 'navy' },
          { href: '/contact', label: 'Get in Touch', variant: 'secondary' },
        ]}
      />
    </>
  );
}
