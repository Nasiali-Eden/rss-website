import Button from './Button.jsx';
import { Eyebrow } from './Section.jsx';

export function VisionBand({ eyebrow, children, quote = false }) {
  return (
    <section className="band band--navy vision">
      <figure className="vision__inner">
        <span className="rule" aria-hidden="true" />
        {eyebrow && <Eyebrow onDark>{eyebrow}</Eyebrow>}
        {quote ? <blockquote className="vision__text">“{children}”</blockquote> : <p className="vision__text">{children}</p>}
      </figure>
    </section>
  );
}

/** variant: sunrise (centred) | sunrise-inline | navy */
export function CTABand({ variant = 'sunrise', title, text, actions = [] }) {
  return (
    <section className={`cta cta--${variant}`}>
      <div className="container cta__inner">
        <div className="cta__copy">
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div className="cta__actions">
          {actions.map((a) => (
            <Button key={a.label} href={a.href} variant={a.variant}>{a.label}</Button>
          ))}
        </div>
      </div>
    </section>
  );
}
