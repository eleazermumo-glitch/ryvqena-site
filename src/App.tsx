import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Agent from './components/Agent';
import Home from './pages/Home';
import Academy from './pages/Academy';
import ProductPage from './pages/ProductPage';
import { products } from './data/site';
import { useRoute } from './hooks/useRoute';

export default function App() {
  const route = useRoute();
  // Scroll to the right place after a route or hash change.
  useEffect(() => {
    const go = () => {
      const h = window.location.hash;
      if (h.startsWith('#/')) { window.scrollTo(0, 0); return; }
      const id = h.replace('#', '');
      const el = id ? document.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      else window.scrollTo(0, 0);
    };
    const t = window.setTimeout(go, 60);
    window.addEventListener('hashchange', go);
    return () => { window.clearTimeout(t); window.removeEventListener('hashchange', go); };
  }, [route]);

  return (
    <>
      <Nav route={route} />
      <main id="main">{route === 'home' ? <Home /> : route === 'academy' ? <Academy /> : <ProductPage product={products.find((p) => p.slug === route)!} />}</main>
      <Footer />
      <Agent />
    </>
  );
}
