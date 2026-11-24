import { inquire } from '../lib/inquiry';

export default function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="wrap cta-in">
        <h2 id="cta-title">Have something to build? Tell us about it.</h2>
        <a className="cta-btn" href="#contact" onClick={() => inquire('Other')}>Make an inquiry</a>
      </div>
    </section>
  );
}
