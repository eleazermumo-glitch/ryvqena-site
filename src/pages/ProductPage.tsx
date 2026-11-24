import Button from '../components/Button';
import { ArrowLeft } from '../components/Icon';
import { logos, type Product } from '../data/site';
import { inquire } from '../lib/inquiry';

export default function ProductPage({ product: p }: { product: Product }) {
  return (
    <section className="gd" aria-labelledby="gd-title">
      <div className="wrap">
        <a className="back mono" href="#products"><ArrowLeft size={16} aria-hidden="true" /> Back to Ryvqena Tech</a>
        <div className={`gd-hero${logos[p.slug] ? '' : ' gd-solo'}`}>
          <div>
            <p className="mono prod-status"><i /> {p.status} &middot; A Ryvqena Tech product</p>
            <h1 id="gd-title" className="gd-title">{p.name}</h1>
            <p className="lead">{p.summary}</p>
            <div className="prod-cta">
              <Button href="#contact" onClick={() => inquire(p.live ? 'GariDoc demo' : 'Vouchify early interest')}>
                {p.live ? 'Request the demo' : 'Register interest'}
              </Button>
              <Button href="#contact" variant="ghost" onClick={() => inquire('Something else')}>Ask a question</Button>
            </div>
          </div>
          {logos[p.slug] && <div className="logo-tile"><img src={logos[p.slug].src} alt={logos[p.slug].alt} width={logos[p.slug].w} height={logos[p.slug].h} /></div>}
        </div>
        <h2 className="gd-sub mono">{p.featuresTitle}</h2>
        <ul className="gd-feat">
          {p.features.map((f, i) => (
            <li key={f.title}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </li>
          ))}
        </ul>
        <p className="gd-caveat"><span className="mono">Honest note</span>{p.caveat}</p>
      </div>
    </section>
  );
}
