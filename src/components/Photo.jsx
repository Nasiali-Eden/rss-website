import { photoUrl } from '../lib/photos.js';
import { SunriseMark } from './Logo.jsx';

/**
 * Wherever an image is missing. Dev: hatched block + label.
 * Production: neutral cream block with the sunrise motif, no label text.
 */
export function PhotoPlaceholder({ label, className = '', dark = false }) {
  const dev = import.meta.env.DEV;
  return (
    <div className={`photo-ph ${dark ? 'photo-ph--dark' : ''} ${dev ? 'photo-ph--dev' : ''} ${className}`.trim()} aria-hidden="true">
      {dev ? label && <span className="photo-ph__label">{label}</span> : <span className="photo-ph__mark"><SunriseMark size={56} /></span>}
    </div>
  );
}

/** Renders the supplied photo, or the placeholder if the file does not exist yet. */
export default function Photo({ slot, alt = '', label, className = '', eager = false, dark = false, width = 1600, height = 686 }) {
  const src = photoUrl(slot);
  if (!src) return <PhotoPlaceholder label={label || (slot ? `Photo ${slot}` : 'Photo')} className={className} dark={dark} />;
  return (
    <img
      className={`photo ${className}`.trim()}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
    />
  );
}
