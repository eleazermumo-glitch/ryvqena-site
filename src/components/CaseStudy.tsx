import Button from './Button';

export type CaseStudyData = {
  id: string; kind: string; status: string; title: string; summary: string;
  problem: string; approach: string; state: string; href?: string;
};

/** Reusable case-study layout. Add an entry to data/site.ts and it renders here. */
export default function CaseStudy({ data, index }: { data: CaseStudyData; index: number }) {
  return (
    <article className="case" aria-labelledby={`case-${data.id}`}>
      <header className="case-head">
        <p className="mono">{String(index + 1).padStart(2, '0')} &mdash; {data.kind}</p>
        <p className="mono case-status"><i /> {data.status}</p>
      </header>
      <div className="case-main">
        <div>
          <h3 id={`case-${data.id}`}>{data.title}</h3>
          <p className="case-sum">{data.summary}</p>
          {data.href && <Button href={data.href} variant="ghost">Read the case</Button>}
        </div>
        <dl className="case-cols">
          <div><dt className="mono">Problem</dt><dd>{data.problem}</dd></div>
          <div><dt className="mono">Approach</dt><dd>{data.approach}</dd></div>
          <div><dt className="mono">Where it stands</dt><dd>{data.state}</dd></div>
        </dl>
      </div>
    </article>
  );
}
