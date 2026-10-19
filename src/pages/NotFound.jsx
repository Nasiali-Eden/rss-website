import Seo from '../lib/seo.jsx';
import Button from '../components/Button.jsx';
import { SunriseMark } from '../components/Logo.jsx';

export default function NotFound() {
  return (
    <>
      <Seo path="/404" title="Page not found | Relief South Sudan" description="The page you were looking for could not be found." />
      <section className="hero hero--plain notfound">
        <div className="container hero__inner">
          <SunriseMark size={72} />
          <h1>We couldn’t find that page.</h1>
          <p className="hero__intro">It may have moved, or the link may be mistyped.</p>
          <div className="hero__actions">
            <Button href="/">Go to the home page</Button>
            <Button href="/contact" variant="secondary">Contact us</Button>
          </div>
        </div>
      </section>
    </>
  );
}
