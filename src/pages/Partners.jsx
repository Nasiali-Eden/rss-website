import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section } from '../components/Section.jsx';
import { PartnerCard } from '../components/Cards.jsx';
import { CTABand } from '../components/Bands.jsx';
import { partners } from '../lib/content.js';

const INTRO =
  'Transformation is stronger when we work together. We are grateful to the churches and organisations who stand with us in serving communities across South Sudan.';

export default function Partners() {
  return (
    <>
      <Seo path="/partners" title="Our Partners | Relief South Sudan" description={INTRO} />
      <Hero variant="plain" eyebrow="Our partners" title="Working together for lasting change." intro={INTRO} />

      <Section bg="white" inner="stack-lg">
        {partners.length > 0 ? (
          <div className="partner-grid">{partners.map((p) => <PartnerCard key={p.name} p={p} />)}</div>
        ) : (
          <p>Our partners will be listed here soon.</p>
        )}
      </Section>

      <CTABand
        variant="navy"
        title="Become a partner"
        text="We welcome churches, foundations, donors and organisations who share our commitment to vulnerable communities."
        actions={[{ href: '/partner', label: 'Partner With Us', variant: 'primary' }]}
      />
    </>
  );
}
