import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section, SectionHeading } from '../components/Section.jsx';
import { StatCounters, StoryCard } from '../components/Cards.jsx';
import { CTABand } from '../components/Bands.jsx';
import Icon from '../components/Icon.jsx';
import SouthSudanMap from '../components/SouthSudanMap.jsx';
import Gallery from '../components/Gallery.jsx';
import { site, pages, gallery, stories, showImpact } from '../lib/content.js';

const INTRO =
  'Relief South Sudan has a national outlook, with particular attention to underserved, rural, marginalised and hard-to-reach areas. Our work is guided by local needs, community participation and opportunities for sustainable impact.';

export default function Impact() {
  const showGallery = site.gallery?.published === true;
  return (
    <>
      <Seo
        path="/impact"
        title="Where We Work & Our Impact | Relief South Sudan"
        description="Registered in Eastern Equatoria and serving communities across South Sudan, with attention to underserved, rural and hard-to-reach areas."
      />
      <Hero variant="page" eyebrow="Impact" title="Serving communities across South Sudan." intro={INTRO} photo="P6" photoLabel="Photo P6 — banner" photoAlt="A large community gathering" />

      <Section bg="white" inner="split split--center">
        <div className="stack">
          <SectionHeading eyebrow="Where we work" title="Rooted in Torit, serving across South Sudan." />
          <p>
            South Sudan’s geographical, cultural and linguistic diversity presents unique challenges and opportunities. From our base in Torit,
            Eastern Equatoria, we work with local communities and partners to develop approaches that respond to the realities of each context.
          </p>
        </div>
        <SouthSudanMap />
      </Section>

      <Section bg="cream" inner="stack-lg">
        <SectionHeading eyebrow="Who we serve" title="Reaching those most in need." />
        <ul className="serve-grid" role="list">
          {pages.whoWeServe.map((g) => (
            <li key={g.label}>
              <span className="serve-grid__icon"><Icon name={g.icon} size={26} /></span>
              <span>{g.label}</span>
            </li>
          ))}
        </ul>
      </Section>

      {showImpact && (
        <Section bg="white" inner="stack-lg">
          <h2 className="h2--md">Impact in numbers</h2>
          <StatCounters stats={site.impact.stats} />
        </Section>
      )}

      {showGallery && (
        <Section bg="white" inner="stack-lg">
          <h2 className="h2--md">Recent activities</h2>
          <Gallery items={gallery} />
        </Section>
      )}

      {stories.length > 0 && (
        <Section bg="cream" inner="stack-lg">
          <h2 className="h2--md">Stories of change</h2>
          <div className="grid grid--cards">{stories.slice(0, 3).map((s) => <StoryCard key={s.slug} item={s} />)}</div>
        </Section>
      )}

      <CTABand
        title="Help us reach more communities."
        actions={[{ href: '/partner', label: 'Partner With Us', variant: 'navy' }]}
      />
    </>
  );
}
