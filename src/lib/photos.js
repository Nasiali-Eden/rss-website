// Photos P1–P7 live in src/assets/photos/p1.jpg … p7.jpg (supplied by the client).
// Missing files never crash the build: the glob simply returns fewer entries and
// <Photo> falls back to <PhotoPlaceholder>.
const files = import.meta.glob('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

const bySlot = {};
for (const [path, url] of Object.entries(files)) {
  const slot = path.split('/').pop().split('.')[0].toLowerCase(); // "p1"
  bySlot[slot] = url;
}

/** Returns the URL for a photo slot ("P5" / "p5"), or null if not supplied yet. */
export function photoUrl(slot) {
  if (!slot) return null;
  return bySlot[String(slot).toLowerCase()] || null;
}
