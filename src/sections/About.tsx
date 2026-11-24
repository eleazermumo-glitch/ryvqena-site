import SectionHead from '../components/SectionHead';
import { principles, values } from '../data/site';

export default function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead index="03" label="About Ryvqena" id="about-title" title={<>Technology earns its place by <em>solving something real.</em></>} />
        <div className="about-grid">
          <div className="about-copy">
            <p className="lead">
              Ryvqena Tech is a technology company focused on engineering intelligent digital solutions, developing software products and solving real-world problems.
            </p>
            <p>
              Technology Beyond the Expected is more than a line. It is how we work: we question the default, look for the smarter approach and hold ourselves to the standard of the work, not the size of the claim.
            </p>
            <p>
              We are early in our journey and we say so. Our first product, GariDoc, is live as a demo and more are on the way. What we promise is the standard we hold ourselves to, not a list of achievements we have not earned yet.
            </p>
            <dl className="mv">
              <div><dt className="mono">Mission</dt><dd>Engineer intelligent, reliable digital solutions that help businesses, institutions and society solve meaningful problems.</dd></div>
              <div><dt className="mono">Vision</dt><dd>Become a technology company known for thinking big, building responsibly and shaping what comes next.</dd></div>
            </dl>
          </div>
          <div className="about-side">
            <p className="mono side-h">Engineering approach</p>
            <ol className="principles">
              {principles.map((p, i) => (
                <li key={p.title}>
                  <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{p.title}</h3><p>{p.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <ul className="values">
          {values.map((v, i) => (
            <li key={v.title}>
              <span className="mono">V.{i + 1}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
