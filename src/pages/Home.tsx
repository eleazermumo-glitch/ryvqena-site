import Hero from '../sections/Hero';
import About from '../sections/About';
import Capabilities from '../sections/Capabilities';
import Products from '../sections/Products';
import Projects from '../sections/Projects';
import Approach from '../sections/Approach';
import Team from '../sections/Team';
import CtaBand from '../sections/CtaBand';
import Contact from '../sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <Capabilities />
      <About />
      <Projects />
      <Approach />
      <Team />
      <CtaBand />
      <Contact />
    </>
  );
}
