import { ArrowUp, Github, Linkedin, Mail, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

export default function Footer() {
  const { personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-dark-950 py-8 sm:py-12 lg:py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 text-center sm:text-left">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/30 border border-neon-blue/40 flex items-center justify-center font-display font-bold text-xs text-neon-blue">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span className="font-display font-bold text-white text-base">
            {personal.name}
          </span>
        </div>

        {/* Social Links (44px tap target on mobile) */}
        <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center rounded-lg hover:text-neon-blue transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center rounded-lg hover:text-neon-purple transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="w-11 h-11 sm:w-auto sm:h-auto flex items-center justify-center rounded-lg hover:text-neon-blue transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        {/* Back to top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 px-3 sm:px-0 text-xs font-mono text-slate-400 hover:text-neon-blue transition-colors cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

      </div>
    </footer>
  );
}
