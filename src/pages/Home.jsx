import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import Button from '../components/Button.jsx';
import Photo from '../components/Photo.jsx';
import { Section, SectionHeading, Eyebrow } from '../components/Section.jsx';
import { ProgrammeGrid, PillarList, StatCounters, PartnerLogoStrip } from '../components/Cards.jsx';
import { VisionBand, CTABand } from '../components/Bands.jsx';
import { site, programmes, pages, partners, stories, showImpact } from '../lib/content.js';

export default function Home() {
  const story = stories[0];
  return (
    <>
      <Seo
        path="/"
        title="Relief South Sudan | Faith-Based Relief & Community Development in South Sudan"
        description="Relief South Sudan serves vulnerable communities through Bible translation, trauma healing, leadership development, clean water and the empowerment of women and girls."
      />
      <Hero
        variant="home"
        eyebrow="Faith-based relief & community development"
        title={site.heroLine}
        intro="Relief South Sudan serves vulnerable and underserved communities across South Sudan through Bible translation, trauma healing, leadership development, clean water, and the empowerment of women and girls."
        photo="P4"
        photoLabel="Photo P4 — outdoor discussion circle, wide shot"
        photoAlt="Community members in an outdoor discussion circle"
      >
        <div className="hero__actions">
          <Button href="/partner">Partner With Us</Button>
          <Button href="/what-we-do" variant="secondary-on-dark">Explore Our Work</Button>
        </div>
      </Hero>

      <Section bg="cream" inner="split split--center">
        <div className="stack">
          <SectionHeading eyebrow="Who we are" title="South Sudanese. Community-based. Christ-centred." />
          <p>
            We are a South Sudanese, community-based Christian organisation. We believe lasting transformation happens when people are
            supported spiritually, socially, emotionally, educationally and economically — so we combine Christian ministry with practical
            action that restores dignity, hope and resilience.
          </p>
          <Button href="/about" variant="text">Learn about us</Button>
        </div>
        {/* P3 is not cleared by the client yet, so P1 is used in its place (HANDOFF §9). */}
        <Photo slot="P1" className="media media--380 only-desktop-block" label="Photo P1 — indoor group (P3 pending clearance)" alt="Church leaders in a small-group discussion during a workshop" />
      </Section>

      <Section bg="white" id="what-we-do" inner="stack-lg" className="section--bleed-mobile">
        <div className="narrow">
          <SectionHeading eyebrow="What we do" title="Holistic ministry. Practical action. Lasting change." />
        </div>
        <ProgrammeGrid items={programmes} />
      </Section>

      <VisionBand eyebrow="Our vision">
        Communities across South Sudan where people have access to God’s Word and opportunities to live with dignity, hope, peace and
        sustainable development.
      </VisionBand>

      {showImpact && (
        <Section bg="white" inner="stack-lg" className="section--ruled">
          <h2 className="h2--md">Our impact</h2>
          <StatCounters stats={site.impact.stats} />
        </Section>
      )}

      <Section bg="white" inner="split split--center split--wide">
        <Photo slot="P2" className="media media--460" label="Photo P2 — outdoor discussion circle" alt="Community members meeting outdoors in a discussion circle" />
        <div className="stack-lg">
          <SectionHeading eyebrow="Our approach" title="We work alongside communities, not for them." />
          <PillarList items={pages.pillars} variant="compact" />
        </div>
      </Section>

      {story && (
        <Section bg="cream" inner="split split--center">
          <Photo slot={story.photo} className="media media--360" label="Story photo" alt={story.alt || ''} />
          <figure className="featured-story">
            <blockquote>“{story.quote}”</blockquote>
            {story.summary && <p>{story.summary}</p>}
            <figcaption>{[story.attribution, story.programme, story.place].filter(Boolean).join(', ')}</figcaption>
          </figure>
        </Section>
      )}

      {partners.length > 0 && (
        <Section bg="white" inner="partners-row">
          <Eyebrow as="h2">Working together with</Eyebrow>
          <PartnerLogoStrip items={partners} />
        </Section>
      )}

      <CTABand
        title="Together, we can make a difference."
        text="The needs across South Sudan are significant — but so are the opportunities for transformation. Join us through funding, expertise, prayer or partnership."
        actions={[
          { href: '/partner', label: 'Partner With Us', variant: 'navy' },
          { href: '/contact', label: 'Get in Touch', variant: 'secondary' },
        ]}
      />
    </>
  );
}
