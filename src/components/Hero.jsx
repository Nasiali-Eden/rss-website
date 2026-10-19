import Photo from './Photo.jsx';
import { Eyebrow } from './Section.jsx';

/** variant: home | page | plain */
export default function Hero({ variant = 'plain', eyebrow, title, intro, photo, photoLabel, photoAlt = '', children }) {
  if (variant === 'plain') {
    return (
      <section className="hero hero--plain">
        <div className="container hero__inner">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1>{title}</h1>
          {intro && <p className="hero__intro">{intro}</p>}
          {children}
        </div>
      </section>
    );
  }
  return (
    <section className={`hero hero--photo hero--${variant}`}>
      <div className="hero__media">
        <Photo slot={photo} alt={photoAlt} label={photoLabel} eager dark />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="container hero__inner">
        {eyebrow && <Eyebrow onDark>{eyebrow}</Eyebrow>}
        <h1>{title}</h1>
        {intro && <p className="hero__intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
