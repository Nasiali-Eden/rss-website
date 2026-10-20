/** Interactive OpenStreetMap embed, always live. */
export default function MapEmbed({ embedUrl, label, tall = false }) {
  return (
    <div className={`map${tall ? ' map--tall' : ''}`}>
      <iframe title={`Map: ${label}`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}
