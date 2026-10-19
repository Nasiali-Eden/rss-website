import { VIEWBOX, OUTLINE, project } from '../lib/southSudanMap.js';
import { locations } from '../lib/content.js';

const TORIT = { name: 'Torit', lon: 32.57, lat: 4.41 };

/** Highlighted areas come from src/content/locations.json ({ name, lon, lat }). Empty → Torit pin only. */
export default function SouthSudanMap() {
  const [tx, ty] = project(TORIT.lon, TORIT.lat);
  return (
    <figure className="ss-map">
      <svg viewBox={VIEWBOX} role="img" aria-labelledby="ss-map-title">
        <title id="ss-map-title">Map of South Sudan showing our base in Torit, Eastern Equatoria</title>
        <path d={OUTLINE} className="ss-map__land" />
        {locations.map((l) => {
          const [x, y] = project(l.lon, l.lat);
          return <circle key={l.name} cx={x} cy={y} r="9" className="ss-map__area" />;
        })}
        <g transform={`translate(${tx} ${ty})`}>
          <circle r="16" className="ss-map__halo" />
          <circle r="7" className="ss-map__pin" />
          <text x="-14" y="5" textAnchor="end" className="ss-map__label">Torit</text>
        </g>
      </svg>
      <figcaption>Our base: Torit, Eastern Equatoria State.</figcaption>
    </figure>
  );
}
