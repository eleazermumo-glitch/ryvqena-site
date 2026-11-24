import SectionHead from '../components/SectionHead';
import { concepts, logos, products } from '../data/site';

export default function Products() {
  return (
    <section id="products" className="sec sec-first" aria-labelledby="prod-title">
      <div className="wrap">
        <SectionHead label="Our software" id="prod-title" title={<>Products we build <em>ourselves.</em></>} />
        {products.map((p) => (
          <article key={p.slug} className={`feat${logos[p.slug] ? ' has-logo' : ''}`}>
            <div className="feat-body">
              <p className="feat-meta"><span className={p.live ? 'live' : ''}>{p.status}</span>{p.descriptor}</p>
              <h3>{p.headline}</h3>
              <p>{p.card}</p>
              <a className="textlink" href={`#/${p.slug}`}>Read about {p.name} &rarr;</a>
            </div>
            {logos[p.slug] && <a className="feat-art logo-tile" href={`#/${p.slug}`} tabIndex={-1}><img src={logos[p.slug].src} alt={logos[p.slug].alt} width={logos[p.slug].w} height={logos[p.slug].h} loading="lazy" /></a>}
          </article>
        ))}
        <div className="pipeline">
          <h3>Also in the pipeline</h3>
          <ul>
            {concepts.map((c) => (
              <li key={c.slug} className={logos[c.slug] ? 'has-logo' : ''}>
                {logos[c.slug] && <div className="logo-tile"><img src={logos[c.slug].src} alt={logos[c.slug].alt} width={logos[c.slug].w} height={logos[c.slug].h} loading="lazy" /></div>}
                <div>
                  <p className="feat-meta"><span>{c.status}</span>{c.descriptor}</p>
                  <h4>{c.name}</h4>
                  <p>{c.card}</p>
                  {c.slug === 'learning-hub' && <a className="textlink" href="#/academy">Open the Academy &rarr;</a>}
                </div>
              </li>
            ))}
          </ul>
          <p className="fine">The Academy is in beta and free to try. EarthTrace is an early idea, not a released product.</p>
        </div>
      </div>
    </section>
  );
}
