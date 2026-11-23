import { motion } from 'framer-motion';
import { BookOpen, Brain, Code2, Cpu, Globe, Terminal, Wrench } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

const categoryIcons = {
  Languages: Code2,
  'ML / AI Tools': Brain,
  'Web Development': Globe,
  'Developer Tools': Wrench,
  'Core Subjects': BookOpen,
};

const categoryAccents = {
  Languages: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
  'ML / AI Tools': 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
  'Web Development': 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  'Developer Tools': 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-300',
  'Core Subjects': 'from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-300',
};

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="relative py-16 sm:py-24 lg:py-32 bg-dark-900/60 scroll-mt-24">
      {/* Background Neon Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Technical Skills"
          title="Core Capabilities &amp;"
          highlight="Tooling"
          subtitle="The languages, frameworks and tools I work with."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {skills.map((group, idx) => {
            const Icon = categoryIcons[group.category] || Cpu;
            const accentClasses = categoryAccents[group.category] || 'border-neon-blue/30 text-neon-blue';
            const layoutClasses =
              idx === 3
                ? 'col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-2'
                : idx === 4
                ? 'col-span-1 md:col-span-2 md:max-w-md md:w-full md:mx-auto lg:max-w-none lg:mx-0 lg:col-span-2'
                : 'col-span-1 md:col-span-1 lg:col-span-2';

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`glass-card rounded-2xl p-5 sm:p-6 lg:p-7 border border-white/10 hover:border-neon-blue/40 hover:shadow-neon-blue transition-all duration-300 flex flex-col justify-between ${layoutClasses}`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-center text-neon-blue">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {group.category}
                    </h3>
                  </div>

                  {/* Grouped Neon Badges */}
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-mono font-medium border bg-gradient-to-r hover:scale-105 transition-transform duration-200 cursor-default ${accentClasses}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 sm:mt-6 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{group.items.length} Skills</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
