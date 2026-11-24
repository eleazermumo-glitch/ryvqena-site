import SectionHead from '../components/SectionHead';
import { team } from '../data/site';

export default function Team() {
  return (
    <section id="team" className="sec sec-alt" aria-labelledby="team-title">
      <div className="wrap">
        <SectionHead index="06" label="Our Team" id="team-title" title={<>The people <em>behind Ryvqena.</em></>} />
        <ul className="team">
          {team.map((m) => (
            <li key={m.name}>
              <figure>
                <img src={m.photo} alt={`${m.name}, ${m.role}`} width={m.w} height={m.h} loading="lazy" decoding="async" style={{ objectPosition: m.pos }} />
                <figcaption><b>{m.name}</b><span>{m.role}</span></figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
