import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2, Cpu, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="relative py-16 sm:py-24 lg:py-32 bg-dark-900/60 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Work Experience"
          title="Hands-On Industry"
          highlight="Internship"
          subtitle="Real-world engineering experience in Generative AI and Agentic AI system architecture."
        />

        <div className="max-w-4xl mx-auto">
          {experience.map((item, idx) => (
            <motion.div
              key={item.company + item.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative pl-6 sm:pl-10 pb-8 sm:pb-12 border-l-2 border-neon-blue/30 last:border-transparent last:pb-0"
            >
              {/* Timeline Node Dot */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-dark-950 border-2 border-neon-blue flex items-center justify-center shadow-neon-blue">
                <Briefcase className="w-4 h-4 text-neon-blue" />
              </div>

              {/* Glassmorphic Experience Card */}
              <div className="glass-card rounded-2xl p-5 sm:p-7 lg:p-9 border border-white/10 hover:border-neon-blue/40 hover:shadow-neon-blue transition-all duration-300">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-xs font-mono text-neon-purple mb-2">
                      <Sparkles className="w-3 h-3" />
                      <span>AICTE Recognized Internship</span>
                    </div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                      {item.role}
                    </h3>
                    <p className="font-display font-medium text-neon-cyan text-sm sm:text-base mt-1">
                      {item.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/5 px-3.5 py-1.5 rounded-lg border border-white/10 w-fit">
                    <Calendar className="w-3.5 h-3.5 text-neon-blue" />
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Resume Bullets */}
                <ul className="space-y-3 sm:space-y-3.5 mt-5 sm:mt-6">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-neon-blue shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Pills */}
                <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-neon-purple" />
                    Focus:
                  </span>
                  {['Generative AI', 'Agentic AI', 'Groq API', 'LLaMA 3.3-70b', 'Genetic Algorithms'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-mono text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
