import { ArrowRight } from '../components/Icon';

export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" role="img" aria-label="The round tower of Nairobi's skyline lit at dusk, with city buildings and palms around it" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-in">
        <p className="hero-eyebrow">Innovation &middot; Impact &middot; Africa</p>
        <h1 id="hero-title">
          Ryvqena Tech
          <span>Technology</span>
          <span><em>Beyond</em> the Expected</span>
        </h1>
        <p className="hero-sub">We design, build and deploy intelligent solutions that solve real problems and power a smarter Kenya.</p>
        <div className="hero-cta">
          <a className="hero-btn hero-btn--p" href="#capabilities">Explore Our Services <ArrowRight size={18} aria-hidden="true" /></a>
          <a className="hero-btn hero-btn--g" href="#about">Read Our Story</a>
        </div>
        <a className="hero-scroll" href="#products"><i aria-hidden="true" />Scroll to explore</a>
      </div>
    </section>
  );
}
