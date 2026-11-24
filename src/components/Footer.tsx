import { company, navItems } from '../data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-id">
          <img src="/images/brand-lockup.webp" alt="Ryvqena Tech" width="445" height="105" loading="lazy" />
          <p className="footer-tag">{company.tagline}.</p>
          <p className="footer-note">Ryvqena Tech is an emerging technology company. GariDoc is our first product and Vouchify is in development.</p>
        </div>
        <nav aria-label="Footer">
          <p className="mono footer-h">Navigate</p>
          <ul>
            {navItems.map((n) => (
              <li key={n.id}><a href={`#${n.id}`}>{n.label}</a></li>
            ))}
            <li><a href="#/garidoc">GariDoc</a></li>
            <li><a href="#/vouchify">Vouchify</a></li>
          </ul>
        </nav>
        <div>
          <p className="mono footer-h">Contact</p>
          <ul>
            <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
            <li><a href={company.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {company.phone}</a></li>
            {company.socials.map((s) => (
              <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer-base mono">
        <span>&copy; {new Date().getFullYear()} Ryvqena Tech</span>
        <a href="#home">Back to top &uarr;</a>
      </div>
    </footer>
  );
}
