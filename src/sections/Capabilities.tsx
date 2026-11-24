import SectionHead from '../components/SectionHead';
import { capabilities } from '../data/site';

export default function Capabilities() {
  return (
    <section id="capabilities" className="sec sec-dark" aria-labelledby="cap-title">
      <div className="wrap">
        <SectionHead label="What we do" id="cap-title" title={<>Five disciplines, <em>one way of working.</em></>} />
        <ul className="caps">
          {capabilities.map((c) => (
            <li key={c.id} className="cap-row">
              <h3>{c.title}</h3>
              <div className="cap-text">
                <p>{c.summary}</p>
                <ul>{c.details.map((d) => (<li key={d}>{d}</li>))}</ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
