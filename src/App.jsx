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

export default function App() {
  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 selection:bg-neon-blue/30 selection:text-neon-blue">
      <CursorGlow />
      <Navbar />
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
