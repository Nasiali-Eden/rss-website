import { useRef, useState, useEffect } from 'react';
import Photo from './Photo.jsx';
import { photoUrl } from '../lib/photos.js';
import Icon from './Icon.jsx';

/** CSS grid + native <dialog> lightbox. Arrow keys move, Esc closes, focus returns. */
export default function Gallery({ items }) {
  const shown = items.filter((g) => photoUrl(g.photo));
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % shown.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + shown.length) % shown.length);
    };
    const onClose = () => triggerRef.current?.focus();
    d.addEventListener('keydown', onKey);
    d.addEventListener('close', onClose);
    return () => {
      d.removeEventListener('keydown', onKey);
      d.removeEventListener('close', onClose);
    };
  }, [shown.length]);

  if (!shown.length) return null;
  const open = (i, e) => {
    triggerRef.current = e.currentTarget;
    setIdx(i);
    dialogRef.current.showModal();
  };
  const cur = shown[idx];
  return (
    <>
      <ul className="gallery" role="list">
        {shown.map((g, i) => (
          <li key={g.photo}>
            <button type="button" className="gallery__btn" onClick={(e) => open(i, e)} aria-label={`Open photo: ${g.alt}`}>
              <Photo slot={g.photo} alt="" />
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialogRef} className="lightbox" aria-label="Photo viewer">
        <img src={photoUrl(cur.photo)} alt={cur.alt} />
        {cur.caption && <p className="lightbox__caption">{cur.caption}</p>}
        <div className="lightbox__controls">
          <button type="button" className="icon-btn" aria-label="Previous photo" onClick={() => setIdx((idx - 1 + shown.length) % shown.length)}><Icon name="arrowLeft" /></button>
          <button type="button" className="icon-btn" aria-label="Next photo" onClick={() => setIdx((idx + 1) % shown.length)}><Icon name="arrowRight" /></button>
          <button type="button" className="icon-btn" aria-label="Close" onClick={() => dialogRef.current.close()}><Icon name="close" /></button>
        </div>
      </dialog>
    </>
  );
}
