import { createContext, useContext, useEffect } from 'react';
import { site, fullAddress } from './content.js';

// During prerender a plain object is provided; <Seo> writes into it so the
// build script can put the right <title>/<meta>/JSON-LD into each HTML file.
export const HeadContext = createContext(null);

export const ngoJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'NGO',
  name: site.name,
  url: site.url,
  logo: `${site.url}/favicon.svg`,
  email: site.email,
  telephone: site.phones[0]?.tel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.line1,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: 'SS',
  },
  sameAs: Object.values(site.social || {}).filter(Boolean),
  description: `A South Sudanese, community-based Christian organisation based in Torit. ${fullAddress}.`,
});

export default function Seo({ title, description, path = '/', jsonLd = [], ogImage = '/og-image.png' }) {
  const head = useContext(HeadContext);
  const canonical = site.url + (path === '/' ? '/' : path.replace(/\/$/, ''));
  const ld = [ngoJsonLd(), ...jsonLd];
  if (head) Object.assign(head, { title, description, canonical, ogImage: site.url + ogImage, jsonLd: ld });

  useEffect(() => {
    document.title = title;
    const set = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.startsWith('link') ? 'link' : 'meta');
        const m = sel.match(/\[(\w+)="([^"]+)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    set('meta[name="description"]', 'content', description);
    set('link[rel="canonical"]', 'href', canonical);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', canonical);
    let s = document.getElementById('ld-json');
    if (!s) {
      s = document.createElement('script');
      s.type = 'application/ld+json';
      s.id = 'ld-json';
      document.head.appendChild(s);
    }
    s.textContent = JSON.stringify(ld);
  }, [title, description, canonical]);

  return null;
}
