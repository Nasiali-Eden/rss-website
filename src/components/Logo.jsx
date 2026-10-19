// TODO: The final vector logo is pending from the client. Replace the SVG and
// wordmark below in this one file and it updates everywhere (header, footer,
// placeholders). Favicon: public/favicon.svg.
export function SunriseMark({ size = 44, rays = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <circle cx="22" cy="22" r="21" fill="none" stroke="#EB9E16" strokeWidth="2" />
      <path d="M10 28a12 12 0 0 1 24 0z" fill="#EB9E16" />
      <path d="M6 28h32" stroke="#F6D569" strokeWidth="2" />
      {rays && <path d="M22 9v4M13 13l2.5 2.5M31 13l-2.5 2.5" stroke="#F6D569" strokeWidth="2" strokeLinecap="round" />}
    </svg>
  );
}

export default function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`}>
      <SunriseMark size={size === 'sm' ? 34 : size === 'footer' ? 40 : 44} rays={size !== 'sm'} />
      <span className="logo__words">
        <span className="logo__relief">Relief</span>
        <span className="logo__country">South Sudan</span>
      </span>
    </span>
  );
}
