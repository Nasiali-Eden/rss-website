import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { HeadContext } from './lib/seo.jsx';
import { programmes, news, site } from './lib/content.js';

export function render(url) {
  const head = {};
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadContext.Provider>
  );
  return { html, head };
}

export const routes = [
  '/',
  '/about',
  '/what-we-do',
  ...programmes.map((p) => `/what-we-do/${p.slug}`),
  '/impact',
  '/team',
  '/partner',
  '/contact',
  '/safeguarding',
  '/privacy',
  '/news',
  ...news.map((n) => `/news/${n.slug}`),
];

export { site };
