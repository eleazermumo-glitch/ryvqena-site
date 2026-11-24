import { useEffect, useState } from 'react';
import { capabilities, company, navItems, products } from '../data/site';
import { ArrowRight, ChevronDown, Menu, X } from './Icon';
import { useScrollSpy } from '../hooks/useScrollSpy';
import type { Route } from '../hooks/useRoute';

const ids = ['products', 'capabilities', ...navItems.map((n) => n.id)];

export default function Nav({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy(ids, route === 'home');

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className={`nav${scrolled || open || route !== 'home' ? ' is-solid' : ' is-over'}`}>
        <div className="nav-in">
          <a className="brand" href="#home" onClick={close} aria-label="Ryvqena Tech home">
            <img className="b-dark" src="/images/brand-lockup-dark.webp" alt="Ryvqena Tech. Technology beyond the expected." width="445" height="105" />
            <img className="b-light" src="/images/brand-lockup.webp" alt="" width="445" height="105" />
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#home" className={route === 'home' && !active ? 'on' : ''}>Home</a>
            <div className="dd">
              <a href="#capabilities" className={active === 'products' || active === 'capabilities' || route !== 'home' ? 'on' : ''} aria-haspopup="true">Services <ChevronDown size={15} aria-hidden="true" /></a>
              <ul className="dd-menu">
                <li><a href="#capabilities"><b>Services</b><span>{capabilities.map((c) => c.title).join(', ')}</span></a></li>
                <li><a href="#/academy"><b>Ryvqena Academy</b><span>Free courses &middot; Beta</span></a></li>
                {products.map((p) => (
                  <li key={p.slug}>
                    <a href={`#/${p.slug}`}><b>{p.name}</b><span>{p.descriptor} &middot; {p.status}</span></a>
                  </li>
                ))}
              </ul>
            </div>
            {navItems.filter((n) => n.id !== 'contact').map((n) => (
              <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'on' : ''} aria-current={active === n.id ? 'true' : undefined}>
                {n.label}
              </a>
            ))}
            <a href="#contact" className={active === 'contact' ? 'on' : ''}>Contact</a>
          </nav>
          <a className="nav-cta" href="#contact">Get Started <ArrowRight size={16} aria-hidden="true" /></a>
          <button className="burger" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={`mmenu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <a href="#home" onClick={close} tabIndex={open ? 0 : -1}>Home</a>
          <a href="#capabilities" onClick={close} tabIndex={open ? 0 : -1}>Services</a>
          {navItems.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={close} tabIndex={open ? 0 : -1}>{n.label}</a>
          ))}
          <a className="mm-cta" href="#contact" onClick={close} tabIndex={open ? 0 : -1}>Get Started</a>
          <p className="mono mm-h">Products</p>
          {products.map((p) => (
            <a key={p.slug} className="mm-sub" href={`#/${p.slug}`} onClick={close} tabIndex={open ? 0 : -1}>{p.name} <ArrowRight size={18} aria-hidden="true" /></a>
          ))}
        </nav>
        <p className="mono mmenu-foot">{company.email}</p>
      </div>
    </>
  );
}
