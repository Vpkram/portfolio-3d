import { motion } from 'framer-motion';
import { CheckCircle2, HeartHandshake, Users } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

export default function Volunteering() {
  const { volunteering } = portfolioData;

  return (
    <section id="volunteering" className="relative py-16 sm:py-24 lg:py-32 bg-dark-950 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Social Impact"
          title="Leadership &amp;"
          highlight="Volunteering"
          subtitle="Positions of responsibility and community initiatives from the resume."
        />

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-5 sm:p-8 lg:p-11 border border-neon-purple/30 relative overflow-hidden shadow-neon-purple"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-7">
              <div className="flex items-start gap-4">
                <span className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    {volunteering.organization}
                  </h3>
                  <p className="font-display font-medium text-neon-cyan text-sm sm:text-base mt-0.5">
                    {volunteering.subtitle} • {volunteering.role}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 w-fit">
                <Users className="w-3.5 h-3.5 text-neon-blue" />
                <span>Community Service</span>
              </div>
            </div>

            {/* 3 Resume Bullets */}
            <ul className="space-y-3 sm:space-y-4 pt-2">
              {volunteering.points.map((pt, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.1 }}
                  className="flex items-start gap-3.5 text-sm sm:text-base text-slate-300 leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
