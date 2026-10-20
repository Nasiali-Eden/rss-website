import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { IconDisc } from './Cards.jsx';
import { programmes, shortTitle, cardLine, showTeam } from '../lib/content.js';

const ABOUT_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/governance', label: 'Governance' },
  { href: '/partners', label: 'Our Partners' },
];

const NAV = [
  { href: '/about', label: 'About', children: ABOUT_LINKS },
  { href: '/what-we-do', label: 'What We Do', mega: true },
  { href: '/impact', label: 'Impact' },
  ...(showTeam ? [{ href: '/team', label: 'Team' }] : []),
  { href: '/partner', label: 'Partner With Us' },
  { href: '/contact', label: 'Contact' },
];

function useHeaderCta(pathname) {
  if (pathname.startsWith('/partner')) return { href: '#enquiry', label: 'Start a Conversation', short: 'Enquire' };
  return { href: '/partner', label: 'Partner With Us', short: 'Partner' };
}

function CtaLink({ cta, className, children }) {
  if (cta.href.startsWith('#')) return <a href={cta.href} className={className}>{children}</a>;
  return <Link to={cta.href} className={className}>{children}</Link>;
}

/** Shared open/close behaviour for header menus: closes on navigation, Escape and outside click. */
function useMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const wrapRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return { open, setOpen, btnRef, wrapRef, pathname };
}

function Dropdown({ item }) {
  const { open, setOpen, btnRef, wrapRef, pathname } = useMenu();
  const active = item.children.some((c) => pathname.startsWith(c.href));
  const id = `dropdown-${item.label.toLowerCase()}`;
  return (
    <li className="dropdown" ref={wrapRef}>
      {/* Plain link works without JS; the chevron button opens the list. */}
      <NavLink to={item.href} end className={`nav__link${active ? ' is-active' : ''}`}>{item.label}</NavLink>
      <button
        ref={btnRef}
        type="button"
        className="mega__toggle"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Show ${item.label} pages`}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="chevron" size={16} strokeWidth={2} />
      </button>
      <ul id={id} className="dropdown__panel" role="list" hidden={!open}>
        {item.children.map((c) => (
          <li key={c.href}>
            <NavLink to={c.href} end className="dropdown__link">{c.label}</NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

function MegaMenu() {
  const { open, setOpen, btnRef, wrapRef, pathname } = useMenu();
  const active = pathname.startsWith('/what-we-do');

  return (
    <li className="mega" ref={wrapRef}>
      {/* Plain link works without JS; the chevron button opens the panel. */}
      <NavLink to="/what-we-do" end className={`nav__link${active ? ' is-active' : ''}`}>What We Do</NavLink>
      <button
        ref={btnRef}
        type="button"
        className="mega__toggle"
        aria-expanded={open}
        aria-controls="mega-panel"
        aria-label="Show programmes"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="chevron" size={16} strokeWidth={2} />
      </button>
      <div id="mega-panel" className="mega__panel" hidden={!open}>
        <ul className="mega__grid" role="list">
          {programmes.map((p) => (
            <li key={p.slug}>
              <Link to={`/what-we-do/${p.slug}`} className="mega__item">
                <IconDisc name={p.icon} size={44} />
                <span>
                  <span className="mega__title">{shortTitle(p)}</span>
                  <span className="mega__line">{cardLine(p)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/what-we-do" className="mega__all">All programmes <span aria-hidden="true">→</span></Link>
      </div>
    </li>
  );
}

function Drawer({ open, onClose, cta, returnFocusRef }) {
  const panelRef = useRef(null);

  const trap = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trap);
    panelRef.current?.querySelector('button')?.focus();
    const ret = returnFocusRef.current;
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', trap);
      ret?.focus();
    };
  }, [open, trap, returnFocusRef]);

  if (!open) return null;
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu" ref={panelRef}>
      <div className="drawer__top">
        <Link to="/" aria-label="Relief South Sudan, home"><Logo size="sm" /></Link>
        <button type="button" className="icon-btn" aria-label="Close menu" onClick={onClose}>
          <Icon name="close" size={24} strokeWidth={2} />
        </button>
      </div>
      <nav aria-label="Mobile" className="drawer__nav">
        <ul role="list">
          {NAV.map((n) => (
            <li key={n.href}>
              <NavLink to={n.href} end={!n.mega && !n.children} className="drawer__link">{n.label}</NavLink>
              {n.children && (
                <ul role="list" className="drawer__sub">
                  {n.children.filter((c) => c.href !== n.href).map((c) => (
                    <li key={c.href}>
                      <NavLink to={c.href} className="drawer__sublink">{c.label}</NavLink>
                    </li>
                  ))}
                </ul>
              )}
              {n.mega && (
                <ul role="list" className="drawer__sub">
                  {programmes.map((p) => (
                    <li key={p.slug}>
                      <NavLink to={`/what-we-do/${p.slug}`} className="drawer__sublink">{shortTitle(p)}</NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <CtaLink cta={cta} className="btn btn--primary btn--block drawer__cta">{cta.label}</CtaLink>
    </div>
  );
}

export default function SiteHeader() {
  const { pathname } = useLocation();
  const cta = useHeaderCta(pathname);
  const [drawer, setDrawer] = useState(false);
  const burgerRef = useRef(null);

  useEffect(() => setDrawer(false), [pathname]);

  return (
    <header className="site-header">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="container site-header__bar">
        <Link to="/" className="site-header__logo" aria-label="Relief South Sudan, home">
          <span className="only-desktop"><Logo /></span>
          <span className="only-mobile"><Logo size="sm" /></span>
        </Link>

        <nav aria-label="Primary" className="nav only-desktop">
          <ul role="list" className="nav__list">
            {NAV.map((n) =>
              n.mega ? (
                <MegaMenu key={n.href} />
              ) : n.children ? (
                <Dropdown key={n.href} item={n} />
              ) : (
                <li key={n.href}>
                  <NavLink to={n.href} className="nav__link">{n.label}</NavLink>
                </li>
              )
            )}
          </ul>
        </nav>

        <CtaLink cta={cta} className="btn btn--primary btn--header only-desktop">{cta.label}</CtaLink>

        <div className="site-header__mobile only-mobile">
          <CtaLink cta={cta} className="btn btn--primary btn--compact">{cta.short}</CtaLink>
          <button
            ref={burgerRef}
            type="button"
            className="icon-btn"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <Icon name="menu" size={24} strokeWidth={2} />
          </button>
        </div>
      </div>
      <Drawer open={drawer} onClose={() => setDrawer(false)} cta={cta} returnFocusRef={burgerRef} />
    </header>
  );
}
