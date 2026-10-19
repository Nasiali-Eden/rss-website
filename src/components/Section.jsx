export function Eyebrow({ children, onDark = false, as: Tag = 'p' }) {
  return <Tag className={`eyebrow${onDark ? ' eyebrow--on-dark' : ''}`}>{children}</Tag>;
}

export function SectionHeading({ eyebrow, title, intro, onDark, id, size }) {
  return (
    <div className="section-heading">
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={size ? `h2--${size}` : undefined}>{title}</h2>
      {intro && <p className="section-heading__intro">{intro}</p>}
    </div>
  );
}

/** bg: white | cream | navy */
export function Section({ bg = 'white', children, className = '', inner = '', id, labelledBy }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`section section--${bg} ${className}`.trim()}>
      <div className={`container ${inner}`.trim()}>{children}</div>
    </section>
  );
}
