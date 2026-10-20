import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section } from '../components/Section.jsx';
import Icon from '../components/Icon.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import Form, { Field, ConsentCheckbox } from '../components/Form.jsx';
import { site } from '../lib/content.js';

const SUBJECTS = ['General', 'Partnership', 'Volunteer', 'Media', 'Prayer'];
const INTRO = 'Whether you want to partner, volunteer, pray with us or learn more about our work, we would love to hear from you.';

function Row({ icon, children }) {
  return (
    <li className="contact-card__row">
      <Icon name={icon} size={22} strokeWidth={1.8} className="contact-card__icon" />
      <span>{children}</span>
    </li>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const [subject, setSubject] = useState('General');
  useEffect(() => {
    const q = (params.get('subject') || '').toLowerCase();
    const match = SUBJECTS.find((s) => s.toLowerCase() === q);
    if (match) setSubject(match);
  }, [params]);

  const social = Object.entries(site.social || {}).filter(([, u]) => u);
  return (
    <>
      <Seo path="/contact" title="Contact Us | Relief South Sudan, Torit" description={INTRO} />
      <Hero variant="plain" title="Get in touch." intro={INTRO} />
      <Section bg="white" inner="contact-layout">
        <div className="contact-side">
          <ul className="contact-card" role="list">
            <Row icon="pin">
              {site.address.line1}, {site.address.locality}
              <br />
              {site.address.region}, {site.address.country}
            </Row>
            <Row icon="mail"><a href={`mailto:${site.email}`}>{site.email}</a></Row>
            <Row icon="phone">
              {site.phones.map((ph) => (
                <span key={ph.tel} className="contact-card__phone">
                  <a href={`tel:${ph.tel}`}>{ph.display}</a>
                  {ph.whatsapp && <> · <a href={`https://wa.me/${ph.whatsapp.replace(/\D/g, '')}`} rel="noopener">WhatsApp</a></>}
                </span>
              ))}
            </Row>
            {site.officeHours && <Row icon="clock">{site.officeHours}</Row>}
            {social.length > 0 && (
              <li className="contact-card__social">
                {social.map(([k, u]) => <a key={k} href={u} rel="noopener" target="_blank">{k}</a>)}
              </li>
            )}
          </ul>
          <MapEmbed embedUrl={site.map?.embedUrl} label="Domus Erum Residence, Torit" />
        </div>
        <Form
          name="contact"
          submitLabel="Send message"
          className="form--plain"
          successMessage="Thank you — your message has been sent. We’ll get back to you soon."
          note="Protected by spam filtering."
        >
          <h2 className="h2--sm">Send us a message</h2>
          <div className="form__grid form__grid--3">
            <Field label="Name" name="name" required autoComplete="name" />
            <Field label="Email" name="email" type="email" required autoComplete="email" />
            <Field label="Phone" optional name="phone" type="tel" autoComplete="tel" />
          </div>
          <div className="form__grid form__grid--3">
            <Field label="Subject" name="subject" as="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </Field>
          </div>
          <Field label="Message" name="message" as="textarea" rows={7} required />
          <ConsentCheckbox>I agree that Relief South Sudan may store my details to respond to this message, as set out in the Privacy Policy.</ConsentCheckbox>
        </Form>
      </Section>
    </>
  );
}
