import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Link } from 'react-router-dom';
import { site } from '../lib/content.js';

// TODO: client to supply policy text. Replace the body below (or move it into
// src/content/policies/*.md and render it) once the policies are approved.
const POLICIES = {
  safeguarding: {
    title: 'Safeguarding',
    seo: 'Safeguarding | Relief South Sudan',
    intro: 'Relief South Sudan is committed to the safety, dignity and wellbeing of every child, young person and adult we work with.',
  },
  privacy: {
    title: 'Privacy',
    seo: 'Privacy Policy | Relief South Sudan',
    intro: 'How Relief South Sudan handles the personal details you share with us through this website.',
  },
};

export default function Policy({ kind }) {
  const p = POLICIES[kind];
  return (
    <>
      <Seo path={`/${kind}`} title={p.seo} description={p.intro} />
      <Hero variant="plain" title={p.title} intro={p.intro} />
      <section className="section section--white">
        <div className="container prose">
          <h2>Policy coming soon</h2>
          <p>
            Our full {p.title.toLowerCase()} policy is being finalised and will be published here. In the meantime, please contact us at{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> with any questions or concerns.
          </p>
          {kind === 'privacy' && (
            <p>
              When you send us a message through this website, we use your details only to respond to you. We never ask for payment details on
              this website.
            </p>
          )}
          <p><Link to="/contact">Contact us</Link></p>
        </div>
      </section>
    </>
  );
}
