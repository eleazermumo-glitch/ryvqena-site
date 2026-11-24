import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from '../components/Icon';
import { courses, PASS, type Course, type Lesson } from '../data/academy';

const KEY = 'rq_academy_v1';
type Saved = { scores: Record<string, number>; name: string };

function load(): Saved {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '');
    if (v && typeof v.scores === 'object') return { scores: v.scores, name: typeof v.name === 'string' ? v.name : '' };
  } catch { /* no saved progress */ }
  return { scores: {}, name: '' };
}

type View = { c: string; l: number | 'cert' } | null;

export default function Academy() {
  const [saved, setSaved] = useState<Saved>(load);
  const [view, setView] = useState<View>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* storage unavailable: progress lasts for this visit */ }
  }, [saved]);

  useEffect(() => { if (view) top.current?.scrollIntoView({ block: 'start' }); }, [view]);

  const done = (c: Course) => c.lessons.filter((l) => (saved.scores[l.id] ?? 0) >= PASS).length;
  const course = view ? courses.find((c) => c.id === view.c)! : null;

  const record = (lesson: Lesson, score: number) =>
    setSaved((s) => ({ ...s, scores: { ...s.scores, [lesson.id]: Math.max(score, s.scores[lesson.id] ?? 0) } }));

  return (
    <section className="ac" aria-labelledby="ac-title">
      <div className="wrap" ref={top}>
        {!course || !view ? (
          <>
            <a className="back mono" href="#products"><ArrowLeft size={16} aria-hidden="true" /> Back to Ryvqena Tech</a>
            <p className="mono prod-status"><i /> Beta &middot; Ryvqena Academy</p>
            <h1 id="ac-title" className="gd-title">Learn. Create. Innovate.</h1>
            <p className="lead">Short, practical courses with a quick check after every lesson. Pass the checks to finish a course and download a certificate of completion. It is free, and you do not need an account.</p>
            <ul className="ac-courses">
              {courses.map((c) => {
                const n = done(c);
                const next = c.lessons.findIndex((l) => (saved.scores[l.id] ?? 0) < PASS);
                return (
                  <li key={c.id} className="ac-card">
                    <p className="feat-meta"><span>{c.level}</span>{c.lessons.length} lessons &middot; about {c.lessons.reduce((a, l) => a + l.minutes, 0)} min</p>
                    <h2>{c.title}</h2>
                    <p>{c.summary}</p>
                    <div className="ac-bar" role="progressbar" aria-valuemin={0} aria-valuemax={c.lessons.length} aria-valuenow={n} aria-label={`${c.title} progress`}><i style={{ width: `${(n / c.lessons.length) * 100}%` }} /></div>
                    <p className="ac-count">{n} of {c.lessons.length} lessons passed</p>
                    <button className="btn btn-primary" type="button" onClick={() => setView({ c: c.id, l: next === -1 ? 'cert' : next })}>
                      {n === 0 ? 'Start course' : next === -1 ? 'Get certificate' : 'Continue'} <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="fine">Your progress is saved in this browser only. Clearing site data or switching device starts you again. Certificates show completion of Ryvqena Academy courses and are not an accredited qualification.</p>
          </>
        ) : (
          <>
            <button className="back mono ac-back" type="button" onClick={() => setView(null)}><ArrowLeft size={16} aria-hidden="true" /> All courses</button>
            <h1 id="ac-title" className="ac-h1">{course.title}</h1>
            <div className="ac-layout">
              <nav aria-label="Lessons" className="ac-side">
                <ol>
                  {course.lessons.map((l, i) => {
                    const ok = (saved.scores[l.id] ?? 0) >= PASS;
                    return (
                      <li key={l.id}>
                        <button type="button" className={view.l === i ? 'on' : ''} aria-current={view.l === i ? 'step' : undefined} onClick={() => setView({ c: course.id, l: i })}>
                          <span className={`ac-dot${ok ? ' ok' : ''}`} aria-hidden="true">{ok ? '✓' : i + 1}</span>
                          <span>{l.title}<small>{ok ? 'Passed' : `${l.minutes} min`}</small></span>
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button type="button" className={view.l === 'cert' ? 'on' : ''} onClick={() => setView({ c: course.id, l: 'cert' })}>
                      <span className="ac-dot" aria-hidden="true">★</span><span>Certificate<small>{done(course) === course.lessons.length ? 'Ready' : 'Locked'}</small></span>
                    </button>
                  </li>
                </ol>
              </nav>
              <div className="ac-main">
                {view.l === 'cert'
                  ? <Certificate course={course} complete={done(course) === course.lessons.length} name={saved.name} setName={(name) => setSaved((s) => ({ ...s, name }))} />
                  : <LessonView key={course.lessons[view.l].id} lesson={course.lessons[view.l]} index={view.l} total={course.lessons.length} best={saved.scores[course.lessons[view.l].id] ?? 0}
                      onScore={(s) => record(course.lessons[view.l as number], s)}
                      onNext={() => setView({ c: course.id, l: (view.l as number) + 1 < course.lessons.length ? (view.l as number) + 1 : 'cert' })} />}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function LessonView({ lesson, index, total, best, onScore, onNext }: { lesson: Lesson; index: number; total: number; best: number; onScore: (n: number) => void; onNext: () => void }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => lesson.quiz.map(() => null));
  const [checked, setChecked] = useState(false);
  const score = useMemo(() => picked.filter((p, i) => p === lesson.quiz[i].answer).length, [picked, lesson]);
  const all = picked.every((p) => p !== null);
  const passed = checked && score >= PASS;

  const check = () => { setChecked(true); onScore(score); };
  const retry = () => { setPicked(lesson.quiz.map(() => null)); setChecked(false); };

  return (
    <article>
      <p className="mono">Lesson {index + 1} of {total} &middot; {lesson.minutes} min</p>
      <h2 className="ac-h2">{lesson.title}</h2>
      {lesson.body.map((p, i) => <p key={i} className="ac-p">{p}</p>)}
      <div className="ac-points"><h3>Key points</h3><ul>{lesson.points.map((p) => <li key={p}>{p}</li>)}</ul></div>

      <h3 className="ac-h3">Check yourself</h3>
      <p className="ac-p">Answer all {lesson.quiz.length} questions. You need {PASS} correct to pass{best >= PASS ? ' (you have already passed this lesson)' : ''}.</p>
      {lesson.quiz.map((q, qi) => (
        <fieldset key={qi} className="ac-q" disabled={checked}>
          <legend>{qi + 1}. {q.q}</legend>
          {q.options.map((o, oi) => {
            const state = checked ? (oi === q.answer ? ' right' : picked[qi] === oi ? ' wrong' : '') : '';
            return (
              <label key={oi} className={`ac-opt${state}`}>
                <input type="radio" name={`${lesson.id}-${qi}`} checked={picked[qi] === oi} onChange={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))} />
                <span>{o}</span>
              </label>
            );
          })}
          {checked && <p className="ac-why"><b>{picked[qi] === q.answer ? 'Correct.' : 'Not quite.'}</b> {q.why}</p>}
        </fieldset>
      ))}
      <div aria-live="polite" className="ac-result">
        {checked && <p><b>{score} of {lesson.quiz.length} correct.</b> {passed ? 'You passed this lesson.' : `You need ${PASS} to pass. Read the explanations and try again.`}</p>}
      </div>
      <div className="ac-actions">
        {!checked && <button className="btn btn-primary" type="button" disabled={!all} onClick={check}>Check answers</button>}
        {checked && !passed && <button className="btn btn-primary" type="button" onClick={retry}>Try again</button>}
        {passed && <button className="btn btn-primary" type="button" onClick={onNext}>{index + 1 < total ? 'Next lesson' : 'Finish course'} <ArrowRight size={18} aria-hidden="true" /></button>}
        {!all && !checked && <span className="ac-hint">Answer every question to check.</span>}
      </div>
    </article>
  );
}

function Certificate({ course, complete, name, setName }: { course: Course; complete: boolean; name: string; setName: (n: string) => void }) {
  if (!complete) {
    return (
      <div>
        <h2 className="ac-h2">Certificate</h2>
        <p className="ac-p">Pass every lesson check in this course to unlock your certificate.</p>
      </div>
    );
  }
  const date = new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
  const clean = name.trim();
  return (
    <div>
      <h2 className="ac-h2">You finished the course</h2>
      <div className="ac-noprint">
        <label className="ac-label" htmlFor="ac-name">Name to print on the certificate</label>
        <input id="ac-name" className="ac-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" maxLength={60} />
      </div>
      <div className="ac-cert" id="ac-cert">
        <img src="/images/brand-lockup-dark.webp" alt="" width="445" height="105" />
        <p className="ac-cert-k">Certificate of completion</p>
        <p>This certifies that</p>
        <p className="ac-cert-name">{clean || 'Your name here'}</p>
        <p>has completed the Ryvqena Academy course</p>
        <p className="ac-cert-course">{course.title}</p>
        <p className="ac-cert-d">{date}</p>
        <p className="ac-cert-fine">Issued by Ryvqena Tech. Not an accredited qualification.</p>
      </div>
      <div className="ac-actions ac-noprint">
        <button className="btn btn-primary" type="button" disabled={!clean} onClick={() => window.print()}>Print or save as PDF</button>
        {!clean && <span className="ac-hint">Enter your name first.</span>}
      </div>
    </div>
  );
}
