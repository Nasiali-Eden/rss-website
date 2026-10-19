import { useState, useId, useEffect } from 'react';

// Provider-agnostic form handling.
// - Default: Netlify Forms (data-netlify attributes, POST urlencoded to "/").
// - Set VITE_FORM_ENDPOINT (e.g. https://formspree.io/f/xxxx) at build time to switch to Formspree.
// Never collect payment data in these forms.
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || '';

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
 * Works without JS (native POST, Netlify redirects back with ?sent=1).
 */
export default function Form({ name, action, submitLabel, successMessage, className = '', children, note }) {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const statusId = useId();
  // Without JS the browser posts natively and the host redirects back with ?sent=1.
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
    setStatus('sending');
    try {
      let res;
      if (ENDPOINT) {
        res = await fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      } else {
        res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString(),
        });
      }
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
      action={ENDPOINT || action}
      data-netlify={ENDPOINT ? undefined : 'true'}
      netlify-honeypot={ENDPOINT ? undefined : 'bot-field'}
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
        {status === 'error' && (
          <p className="form__msg form__msg--err">
            Sorry, your message could not be sent. Please try again, or email us directly.
          </p>
        )}
      </div>
    </form>
  );
}
