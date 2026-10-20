import { useState, useId, useEffect } from 'react';
import { site } from '../lib/content.js';

// Provider-agnostic form handling (the site is static, hosted on Vercel).
// - Set VITE_FORM_ENDPOINT (e.g. https://formspree.io/f/xxxx) at build time to deliver submissions by email
//   without the visitor leaving the page.
// - Without it, submitting opens the visitor's email app with the message filled in, addressed to site.email.
// Never collect payment data in these forms.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';
const SKIP = new Set(['form-name', 'bot-field', 'consent']);

const LABELS = { name: 'Name', email: 'Email', phone: 'Phone', subject: 'Subject', organisation: 'Organisation', country: 'Country', message: 'Message' };

/** Builds a mailto: link from the form fields (checkbox groups are joined). */
function mailtoFrom(formName, data) {
  const fields = {};
  for (const [k, v] of data.entries()) {
    if (SKIP.has(k) || !String(v).trim()) continue;
    fields[k] = fields[k] ? `${fields[k]}, ${v}` : String(v);
  }
  const { message = '', ...rest } = fields;
  const lines = Object.entries(rest).map(([k, v]) => `${LABELS[k] || k}: ${v}`);
  const body = [...lines, '', message].join('\n');
  const subject = `Website ${formName === 'partnership' ? 'partnership enquiry' : 'message'}${fields.name ? ` from ${fields.name}` : ''}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Field({ label, optional, name, type = 'text', required, autoComplete, as = 'input', rows, children, defaultValue, value, onChange }) {
  const Control = as;
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required && <span className="field__req" aria-hidden="true"> *</span>}
        {optional && <span className="field__opt"> (optional)</span>}
      </span>
      <Control
        name={name}
        type={as === 'input' ? type : undefined}
        required={required}
        autoComplete={autoComplete}
        rows={rows}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className={`field__control field__control--${as}`}
      >
        {children}
      </Control>
    </label>
  );
}

export function CheckboxGroup({ legend, name, options, checked = [], onToggle }) {
  return (
    <fieldset className="checkbox-group">
      <legend>{legend}</legend>
      <div className="checkbox-group__items">
        {options.map((o) => (
          <label key={o.value} className="check">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={onToggle ? checked.includes(o.value) : undefined}
              onChange={onToggle ? () => onToggle(o.value) : undefined}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ConsentCheckbox({ children }) {
  return (
    <label className="check check--consent">
      <input type="checkbox" name="consent" value="yes" required />
      <span>{children} <span className="field__req" aria-hidden="true">*</span></span>
    </label>
  );
}

function Honeypot() {
  return (
    <p className="visually-hidden" aria-hidden="true">
      <label>
        Leave this field empty
        <input name="bot-field" tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}

/**
 * <Form name="contact" successMessage="…"> fields </Form>
 * Works without JS (native POST to the form service, or the browser's mailto handling).
 */
export default function Form({ name, submitLabel, successMessage, className = '', children, note }) {
  const [status, setStatus] = useState('idle'); // idle | sending | success | mailto | error
  const statusId = useId();
  // A form service can redirect back with ?sent=1 after a no-JS post.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('sent') === '1') setStatus('success');
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    // Honeypot: bots fill every field. Pretend success, send nothing.
    if (data.get('bot-field')) {
      setStatus('success');
      return;
    }
    if (!ENDPOINT) {
      window.location.href = mailtoFrom(name, data);
      setStatus('mailto');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form
      name={name}
      method="POST"
      // Without JS: post to the form service, or fall back to the browser's own mailto handling.
      action={ENDPOINT || `mailto:${site.email}`}
      encType={ENDPOINT ? undefined : 'text/plain'}
      onSubmit={onSubmit}
      className={`form ${className}`.trim()}
      aria-describedby={statusId}
    >
      <input type="hidden" name="form-name" value={name} />
      <Honeypot />
      {children}
      <button type="submit" className="btn btn--primary form__submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
      </button>
      {note && <p className="form__note">{note}</p>}
      <div id={statusId} aria-live="polite" className="form__status">
        {status === 'success' && <p className="form__msg form__msg--ok">{successMessage}</p>}
        {status === 'mailto' && (
          <p className="form__msg form__msg--ok">
            Your email app should now open with your message ready to send. If it doesn’t, please email us at{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
        {status === 'error' && (
          <p className="form__msg form__msg--err">
            Sorry, your message could not be sent. Please try again, or email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
      </div>
    </form>
  );
}
