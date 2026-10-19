// Phase 2: News. The collection and routes exist but are hidden from navigation.
import { Link, useParams } from 'react-router-dom';
import Seo from '../lib/seo.jsx';
import Hero from '../components/Hero.jsx';
import { Section } from '../components/Section.jsx';
import { StoryCard } from '../components/Cards.jsx';
import { news } from '../lib/content.js';
import NotFound from './NotFound.jsx';

export function NewsIndex() {
  return (
    <>
      <Seo path="/news" title="News | Relief South Sudan" description="Field updates from Relief South Sudan." />
      <Hero variant="plain" title="News from the field" />
      <Section bg="white" inner="stack-lg">
        {news.length ? (
          <ul className="grid grid--cards" role="list">
            {news.map((n) => <li key={n.slug}><Link to={`/news/${n.slug}`} className="plain-link"><StoryCard item={n} /></Link></li>)}
          </ul>
        ) : (
          <p>Updates will appear here soon.</p>
        )}
      </Section>
    </>
  );
}

export function NewsArticle() {
  const { slug } = useParams();
  const n = news.find((x) => x.slug === slug);
  if (!n) return <NotFound />;
  return (
    <>
      <Seo path={`/news/${n.slug}`} title={`${n.title} | Relief South Sudan`} description={n.summary || n.title} />
      <Hero variant="plain" title={n.title} intro={[n.date, n.place].filter(Boolean).join(' · ')} />
      <section className="section section--white"><div className="container prose">{(n.body || '').split('\n\n').map((para, i) => <p key={i}>{para}</p>)}</div></section>
    </>
  );
}
