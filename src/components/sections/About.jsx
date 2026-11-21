import { motion } from 'framer-motion';
import { Award, BookOpen, Brain, CheckCircle2, GraduationCap, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import SectionHeading from '../ui/SectionHeading';

const metrics = [
  { label: 'Academic CGPA', value: '9.28', detail: 'B.Tech CSE (2024–2028)' },
  { label: 'ML Dataset Scale', value: '284K+', detail: 'Credit Card Transactions' },
  { label: 'Genetic Algorithm', value: '3 Gens', detail: 'Automated Fix Evolution' },
  { label: 'Core Focus', value: 'GenAI', detail: 'LLaMA 3.3-70b & Groq API' },
];

export default function About() {
  const { about } = portfolioData;

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-dark-950 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="About Me"
          title="Engineering Autonomous"
          highlight="AI Systems"
          subtitle="Machine learning and agentic AI, built from real projects and datasets."
        />

        {/* Glassmorphic About Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-neon-blue/20 relative overflow-hidden"
        >
          {/* Subtle Top Border Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-neon-purple opacity-75" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-xs font-mono text-neon-blue">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Annamacharya University • B.Tech CSE</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white leading-snug">
                Building Next-Generation <span className="text-gradient-neon">Generative &amp; Agentic AI</span> Solutions
              </h3>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {about.summary}
              </p>

              {/* Bulleted Resume Facts */}
              <div className="space-y-3.5 pt-2">
                {about.highlights.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.1 }}
                    className="flex items-start gap-3 text-sm sm:text-base text-slate-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Metric Badges Column */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {metrics.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="glass-card rounded-2xl p-5 border border-white/10 hover:border-neon-blue/40 hover:shadow-neon-blue transition-all group"
                >
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-white group-hover:text-gradient-neon transition-all">
                    {item.value}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-2">
                    {item.label}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {item.detail}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
