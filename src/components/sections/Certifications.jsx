import { motion } from 'framer-motion';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const certCards = [
  {
    title: 'Web Development Certification',
    issuer: 'SkillForge E-Learning Solutions Pvt Ltd',
    date: 'Nov 2024',
    fileUrl: '/certificates/skillforge-web-development.pdf',
    fileName: 'skillforge-fullstack.pdf',
  },
  {
    title: 'SQL (Intermediate) Certificate',
    issuer: 'HackerRank',
    date: null,
    fileUrl: '/certificates/sql_intermediate_hackerrank.pdf',
    fileName: 'sql_intermediate certificate_hackerrank.pdf',
  },
  {
    title: 'Gen AI & Agentic AI Internship Certification',
    issuer: 'BrainOvision Solutions Pvt. Ltd. (AICTE)',
    date: 'Jul 2026',
    fileUrl: '/certificates/genai-agentic-ai-internship.pdf',
    fileName: 'genai-agentic-ai-internship.pdf',
  },
];

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-16 sm:py-24 lg:py-32 bg-dark-900/60 scroll-mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Credentials"
          title="Earned"
          highlight="Certifications"
          subtitle="Courses and programs I have completed."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {certCards.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="glass-card rounded-2xl p-5 sm:p-6 lg:p-7 border border-white/10 hover:border-neon-blue/40 hover:shadow-neon-blue transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Icon */}
                <div className="mb-5">
                  <span className="w-11 h-11 rounded-xl bg-dark-950 border border-neon-blue/30 flex items-center justify-center text-neon-blue shadow-neon-blue">
                    <Award className="w-5 h-5" />
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-white mb-2 leading-snug">
                  {cert.title}
                </h3>

                <p className="font-display font-medium text-neon-cyan text-sm mb-3">
                  {cert.issuer}
                </p>

                {cert.date ? (
                  <p className="text-xs font-mono text-slate-400 mb-6">
                    Issued: {cert.date}
                  </p>
                ) : (
                  <p className="text-xs font-mono text-slate-400 mb-6">&nbsp;</p>
                )}
              </div>

              {/* Action Button: View Certificate */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                {cert.fileUrl ? (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider text-neon-blue bg-neon-blue/10 border border-neon-blue/30 hover:bg-neon-blue/20 hover:shadow-neon-blue transition-all"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <div className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-0 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 bg-white/5 border border-white/10">
                    <CheckCircle className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>AICTE Certified</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
