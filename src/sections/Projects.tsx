import SectionHead from '../components/SectionHead';
import CaseStudy from '../components/CaseStudy';
import { caseStudies } from '../data/site';

export default function Projects() {
  return (
    <section id="projects" className="sec sec-alt" aria-labelledby="proj-title">
      <div className="wrap">
        <SectionHead index="04" label="Projects & Case Studies" id="proj-title" title={<>Work, <em>documented honestly.</em></>} />
        <div className="cases">
          {caseStudies.map((c, i) => (<CaseStudy key={c.id} data={c} index={i} />))}
          <div className="case case-empty">
            <p className="mono">{String(caseStudies.length + 1).padStart(2, '0')} &mdash; Next case study</p>
            <p>Your project could be the next one documented here.</p>
            <a className="textlink" href="#contact">Start a conversation &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  );
}
