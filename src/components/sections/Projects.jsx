import { motion } from 'framer-motion';
import { ArrowUpRight, Bot, CheckCircle2, Database, Github, ShieldAlert } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';

const projectCategoryIcons = {
  'Agentic AI': Bot,
  'Machine Learning': ShieldAlert,
  'Machine Learning / NLP': Database,
};

export default function Projects() {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="relative py-16 sm:py-24 lg:py-32 bg-dark-950 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Featured Projects"
          title="Engineered With"
          highlight="Precision"
          subtitle="Three core machine learning and agentic systems built with real workflows and datasets."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, idx) => {
            const Icon = projectCategoryIcons[project.category] || Bot;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                className="h-full"
              >
                <TiltCard className="p-5 sm:p-7 lg:p-8 flex flex-col justify-between h-full border border-white/10 hover:border-neon-blue/40 transition-colors">
                  
                  <div>
                    {/* Top Row: Category Pill + Project Number */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{project.category}</span>
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-white mb-3 sm:mb-4 leading-snug">
                      {project.title}
                    </h3>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 bg-white/5 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Project Bullet Points from Resume */}
                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                      {project.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-neon-blue shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action: View on GitHub */}
                  <div className="pt-4 sm:pt-5 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center sm:justify-start gap-2 min-h-[44px] sm:min-h-0 text-xs font-mono font-medium text-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20 px-4 sm:px-3.5 py-2.5 sm:py-2 rounded-lg border border-neon-blue/30 hover:border-neon-blue/50 hover:shadow-neon-blue transition-all group/btn"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View on GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-neon-cyan group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>

                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
