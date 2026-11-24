import SectionHead from '../components/SectionHead';
import { stages } from '../data/site';

export default function Approach() {
  return (
    <section id="approach" className="sec" aria-labelledby="ap-title">
      <div className="wrap">
        <SectionHead index="05" label="Our Approach" id="ap-title" title={<>From first question <em>to live system.</em></>} />
        <ol className="ap-list">
          {stages.map((s) => (
            <li key={s.n} className="ap-step">
              <span className="ap-n mono">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
