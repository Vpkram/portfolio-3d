import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import CursorGlow from './components/layout/CursorGlow';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import CinematicIntro from './components/intro/CinematicIntro';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Certifications from './components/sections/Certifications';
import Volunteering from './components/sections/Volunteering';
import Contact from './components/sections/Contact';

export default function App() {
  const introTrackRef = useRef(null);

  // useScroll scrubbed across the first 100vh pinned stage
  const { scrollYProgress } = useScroll({
    target: introTrackRef,
    offset: ['start start', 'end end'],
  });

  // Requirement 7: Navbar and resume button stay hidden at the very top,
  // and fade in once scrolled past about 30% of the intro.
  const navbarOpacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);
  const navbarY = useTransform(scrollYProgress, [0.25, 0.35], [-20, 0]);
  const [isNavbarActive, setIsNavbarActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY > window.innerHeight * 0.3;
    }
    return false;
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsNavbarActive(latest >= 0.3);
  });

  return (
    <div className="relative min-h-[100svh] w-full overflow-x-clip bg-dark-950 text-slate-100 selection:bg-neon-blue/30 selection:text-neon-blue">
      <CursorGlow />

      {/* Navbar & Resume Button: hidden at very top, fades in past 30% of intro */}
      <motion.div
        style={{
          opacity: navbarOpacity,
          y: navbarY,
          pointerEvents: isNavbarActive ? 'auto' : 'none',
        }}
      >
        <Navbar />
      </motion.div>

      <main>
        {/* Requirement 1 & 6: Scroll-driven First Page (100vh) pinned above existing hero */}
        <div id="intro-hero-wrapper" ref={introTrackRef} className="relative h-[200vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Base Layer: Existing Hero */}
            <div className="absolute inset-0 w-full h-full z-0">
              <Hero />
            </div>

            {/* Top Layer: Scroll-driven RAM Orange Intro */}
            <CinematicIntro scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Existing sections continue normally */}
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <Volunteering />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
