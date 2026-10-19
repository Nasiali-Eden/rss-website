import { useParams } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Button from '../components/Button.jsx';
import Photo from '../components/Photo.jsx';
import Breadcrumb, { breadcrumbJsonLd } from '../components/Breadcrumb.jsx';
import { Section, Eyebrow } from '../components/Section.jsx';
import { IconDisc, ChecklistGrid, RelatedCard, StoryCard } from '../components/Cards.jsx';
import { VisionBand, CTABand } from '../components/Bands.jsx';
import { programmeBySlug, news, site } from '../lib/content.js';
import NotFound from './NotFound.jsx';

// Per-programme closing line for the inline CTA band.
const CTA_LINES = {
  'bible-translation-literacy': 'Help put Scripture and literacy within reach of every language community.',
  'trauma-healing-peacebuilding': 'Help communities heal, rebuild relationships and live in peace.',
  'church-leadership': 'Help equip local leaders to serve their churches and communities.',
  'girls-empowerment': 'Help girls grow up safe, educated, empowered and hopeful.',
  wash: 'Help communities access safe water and stay healthy.',
  'women-livelihoods': 'Help women build sustainable livelihoods for their families.',
};

export default function Programme() {
  const { slug } = useParams();
  const p = programmeBySlug[slug];
  if (!p) return <NotFound />;
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'What We Do', href: '/what-we-do' },
    { label: p.shortTitle || p.title, href: `/what-we-do/${p.slug}` },
  ];
  const fieldUpdates = news.filter((n) => (n.programmes || []).includes(p.slug));
  const related = (p.related || []).map((s) => programmeBySlug[s]).filter(Boolean);
  // Programmes with sensitive participants never use photos of identifiable people.
  const photoLabel = p.image ? `Photo ${p.image}` : p.imageRule || 'Photo needed';

  return (
    <>
      <Seo
        path={`/what-we-do/${p.slug}`}
        title={p.seoTitle}
        description={`${p.tagline} ${p.response}`.slice(0, 155)}
        jsonLd={[breadcrumbJsonLd(crumbs, site.url)]}
      />
      <section className="hero hero--programme">
        <div className="container">
          <Breadcrumb items={crumbs} />
          <div className="split split--center">
            <div className="stack">
              <IconDisc name={p.icon} size={60} amber />
              <h1>{p.title}</h1>
              <p className="hero__intro">{p.tagline}</p>
              <div className="hero__actions">
                <Button href="/partner">Support this programme</Button>
                <Button href="/contact" variant="secondary">Get in Touch</Button>
              </div>
            </div>
            <Photo slot={p.image} className="media media--420" label={photoLabel} alt={p.imageAlt || ''} eager />
          </div>
        </div>
      </section>

      <Section bg="white" inner="split split--top">
        <div className="stack-sm">
          <Eyebrow as="h2">The need</Eyebrow>
          <p className="need">{p.need}</p>
        </div>
        <div className="stack-sm">
          <Eyebrow as="h2">Our response</Eyebrow>
          <p>{p.response}</p>
        </div>
      </Section>

      <Section bg="white" inner="stack-lg" className="section--flush-top">
        <h2 className="h2--md">What we do</h2>
        <ChecklistGrid items={p.activities} />
      </Section>

      <VisionBand quote>{p.outcome}</VisionBand>

      {fieldUpdates.length > 0 && (
        <Section bg="cream" inner="stack-lg">
          <h2 className="h2--sm">From the field</h2>
          <div className="grid grid--split">
            {fieldUpdates.slice(0, 2).map((n) => <StoryCard key={n.slug} item={n} />)}
          </div>
        </Section>
      )}

      <Section bg={fieldUpdates.length > 0 ? 'white' : 'cream'} inner="stack-lg">
        <h2 className="h2--sm">Related programmes</h2>
        <div className="grid grid--split">
          {related.map((r) => <RelatedCard key={r.slug} p={r} />)}
        </div>
      </Section>

      <CTABand
        variant="sunrise-inline"
        title="Support this programme"
        text={CTA_LINES[p.slug]}
        actions={[{ href: '/partner', label: 'Partner With Us', variant: 'navy' }]}
      />
    </>
  );
}
