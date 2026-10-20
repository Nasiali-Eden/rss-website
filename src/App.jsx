import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import WhatWeDo from './pages/WhatWeDo.jsx';
import Programme from './pages/Programme.jsx';
import Impact from './pages/Impact.jsx';
import Team from './pages/Team.jsx';
import Partner from './pages/Partner.jsx';
import Governance from './pages/Governance.jsx';
import Partners from './pages/Partners.jsx';
import Contact from './pages/Contact.jsx';
import Policy from './pages/Policy.jsx';
import NotFound from './pages/NotFound.jsx';
import { NewsIndex, NewsArticle } from './pages/News.jsx';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
    // Move focus to main content for screen-reader users on client-side navigation.
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/what-we-do/:slug" element={<Programme />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/team" element={<Team />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/safeguarding" element={<Policy kind="safeguarding" />} />
          <Route path="/privacy" element={<Policy kind="privacy" />} />
          <Route path="/news" element={<NewsIndex />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
