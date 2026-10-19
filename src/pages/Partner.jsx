import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section, Eyebrow } from '../components/Section.jsx';
import { PartnerCard } from '../components/Cards.jsx';
import Icon from '../components/Icon.jsx';
import Form, { Field, CheckboxGroup, ConsentCheckbox } from '../components/Form.jsx';
import { pages, partners, site } from '../lib/content.js';

const INTRO =
  'Relief South Sudan welcomes partnerships with churches, foundations, donors, humanitarian organisations, development agencies, businesses and individuals who share our commitment to serving vulnerable communities.';

export default function Partner() {
  const [params] = useSearchParams();
  const [interests, setInterests] = useState([]);
  // Pre-check an interest from ?interest=prayer (after hydration, so server and client HTML match).
  useEffect(() => {
    const q = params.get('interest');
    if (q && pages.partnerWays.some((w) => w.id === q)) setInterests((cur) => (cur.includes(q) ? cur : [...cur, q]));
  }, [params]);
  const toggle = (v) => setInterests((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  const profile = site.documents?.profile;

  return (
    <>
      <Seo path="/partner" title="Partner With Us | Support Relief South Sudan" description={INTRO.slice(0, 155)} />
      <Hero variant="plain" eyebrow="Partner with us" title="Transformation is stronger when we work together." intro={INTRO} />

      <Section bg="white" inner="stack-lg">
        <h2 className="h2--md">Five ways to partner</h2>
        <ul className="ways" role="list">
          {pages.partnerWays.map((w) => (
            <li key={w.id} id={w.id} className="card way">
              <Icon name={w.icon} size={28} />
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section bg="cream" inner="split split--top">
        <div className="stack">
          <h2 className="h2--sm">Who we work with</h2>
          <ul className="pills" role="list">
            {pages.workWith.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
        {partners.length > 0 && (
          <div className="stack">
            <h2 className="h2--sm">Our partners</h2>
            <div className="partner-cards">{partners.map((p) => <PartnerCard key={p.name} p={p} />)}</div>
          </div>
        )}
      </Section>

      <Section bg="white" id="enquiry" inner="split split--top">
        <div className="stack">
          <Eyebrow>Partnership enquiry</Eyebrow>
          <h2>Start a conversation.</h2>
          <p className="muted">Tell us a little about you and how you’d like to work together. We’ll reply by email.</p>
          {profile && <a href={profile} className="btn btn--text">Download our profile (PDF) <span aria-hidden="true">→</span></a>}
        </div>
        <Form
          name="partnership"
          action="/partner?sent=1#enquiry"
          submitLabel="Send enquiry"
          className="form--panel"
          successMessage="Thank you — your enquiry has been sent. We’ll reply by email."
        >
          <div className="form__grid form__grid--2">
            <Field label="Name" name="name" required autoComplete="name" />
            <Field label="Organisation" name="organisation" autoComplete="organization" />
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field label="Country" name="country" autoComplete="country-name" />
          </div>
          <CheckboxGroup
            legend="Partnership interest"
            name="interest"
            options={pages.partnerWays.map((w) => ({ value: w.id, label: w.label }))}
            checked={interests}
            onToggle={toggle}
          />
          <Field label="Message" name="message" as="textarea" rows={5} required />
          <ConsentCheckbox>I agree that Relief South Sudan may store my details to respond to this enquiry, as set out in the Privacy Policy.</ConsentCheckbox>
        </Form>
      </Section>
    </>
  );
}
