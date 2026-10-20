import logoOnDark from '../assets/brand/logo-on-dark.webp';

// The client's logo (background removed, with a thin white outline so the black
// silhouette reads on navy). Source: src/assets/brand/logo-original.jpeg.
// Favicons live in public/ (favicon.ico, favicon-32.png, icon-192.png, apple-touch-icon.png).
// SunriseMark is kept as a small decorative mark for photo placeholders and the 404 page.
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

const HEIGHTS = { sm: 58, md: 88, footer: 130 };

export default function Logo({ size = 'md' }) {
  const h = HEIGHTS[size] || HEIGHTS.md;
  return (
    <span className={`logo logo--${size}`}>
      <img src={logoOnDark} alt="Relief South Sudan" height={h} width={Math.round((h * 597) / 452)} className="logo__img" />
    </span>
  );
}
