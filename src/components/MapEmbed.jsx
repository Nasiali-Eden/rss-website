import { useState } from 'react';
import { PhotoPlaceholder } from './Photo.jsx';

/** Static image first. The iframe is only injected after the visitor asks for it. */
export default function MapEmbed({ staticImage, embedUrl, label }) {
  const [live, setLive] = useState(false);
  if (live) {
    return (
      <div className="map map--live">
        <iframe title={`Map: ${label}`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer" />
      </div>
    );
  }
  return (
    <div className="map">
      {staticImage ? <img src={staticImage} alt={`Map showing ${label}`} loading="lazy" /> : <PhotoPlaceholder label={`Static map image — ${label}`} />}
      <button type="button" className="btn btn--secondary btn--light map__btn" onClick={() => setLive(true)}>Load interactive map</button>
    </div>
  );
}
