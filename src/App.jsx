import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import CursorGlow from './components/layout/CursorGlow';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Education from './components/sections/Education';
import Certifications from './components/sections/Certifications';
import Volunteering from './components/sections/Volunteering';
import Contact from './components/sections/Contact';

// Lazy-load cinematic intro so initial page load is fast
const CinematicIntro = lazy(() => import('./components/intro/CinematicIntro'));

function checkShouldShowIntro() {
  try {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
    return !sessionStorage.getItem('cinematic_intro_seen');
  } catch {
    return false;
  }
}

export default function App() {
  const [showIntro, setShowIntro] = useState(checkShouldShowIntro);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 selection:bg-neon-blue/30 selection:text-neon-blue">
      {showIntro && (
        <Suspense fallback={null}>
          <CinematicIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}
      <CursorGlow />
      {/* Hide navbar and resume button until intro ends, then fade them in */}
      <motion.div
        initial={showIntro ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -20 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ pointerEvents: showIntro ? 'none' : 'auto' }}
      >
        <Navbar />
      </motion.div>
      <main>
        <Hero />
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
