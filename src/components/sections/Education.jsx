import { motion } from 'framer-motion';
import { Award, Calendar, GraduationCap, School } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

const eduIcons = [GraduationCap, School, School];

export default function Education() {
  const { education } = portfolioData;

  return (
    <section id="education" className="relative py-24 sm:py-32 bg-dark-950 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Academic Background"
          title="Education &amp;"
          highlight="Qualifications"
          subtitle="My academic journey so far."
        />

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((item, idx) => {
            const Icon = eduIcons[idx] || GraduationCap;
            const isLatest = idx === 0;

            return (
              <motion.div
                key={item.degree}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                className={`glass-card rounded-2xl p-7 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
                  isLatest
                    ? 'border-neon-blue/40 shadow-neon-blue'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isLatest && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        isLatest
                          ? 'bg-neon-blue/10 border-neon-blue/30 text-neon-blue'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                          {item.degree}
                        </h3>
                        {isLatest && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-neon-blue bg-neon-blue/10 border border-neon-blue/30">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="font-display text-slate-300 text-sm sm:text-base mt-1">
                        {item.institute}
                      </p>
                    </div>
                  </div>

                  {/* Score & Year Column */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-neon-blue/15 to-neon-purple/15 border border-neon-blue/30 text-neon-cyan font-mono font-bold text-base sm:text-lg">
                      <Award className="w-4 h-4 text-neon-blue" />
                      <span>{item.score}</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
