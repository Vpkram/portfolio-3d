import { useState, useEffect } from 'react';
import { Menu, X, Download, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Volunteering', href: '#volunteering' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track active section on scroll
  useEffect(() => {
    const sections = [
      'hero',
      'about',
      'skills',
      'projects',
      'experience',
      'education',
      'certifications',
      'volunteering',
      'contact',
    ];

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      const scrollPosition = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bulletproof resume download
  const handleDownloadResume = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch('/resume.pdf');
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pavan_Kalyan_Ram_Vanama_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open('/resume.pdf', '_blank');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/30 border border-neon-blue/40 flex items-center justify-center font-display font-bold text-sm text-neon-blue shadow-neon-blue group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Pavan<span className="text-neon-blue">.AI</span>
          </span>
        </a>

        {/* Desktop Nav Links with Active Scroll Highlighting */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
                  isActive
                    ? 'text-neon-blue bg-neon-blue/15 border border-neon-blue/35 shadow-[0_0_12px_rgba(0,240,255,0.25)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* RESUME CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="/resume.pdf"
            download="Pavan_Kalyan_Ram_Vanama_Resume.pdf"
            onClick={handleDownloadResume}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-neon-blue border border-neon-blue/40 bg-neon-blue/10 hover:bg-neon-blue/20 hover:shadow-neon-blue transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            RESUME
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden glass-nav border-t border-white/10 mt-3 px-4 pt-4 pb-6 space-y-1">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'text-neon-blue bg-neon-blue/15 border border-neon-blue/30 font-semibold'
                    : 'text-slate-200 hover:text-neon-blue hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="/resume.pdf"
            download="Pavan_Kalyan_Ram_Vanama_Resume.pdf"
            onClick={handleDownloadResume}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-neon-blue to-neon-purple cursor-pointer shadow-neon-blue min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
