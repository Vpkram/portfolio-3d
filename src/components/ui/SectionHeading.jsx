import { motion } from 'framer-motion';

export default function SectionHeading({ badge, title, highlight, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-1"
    >
      {badge && (
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-neon-blue bg-neon-blue/10 border border-neon-blue/30 mb-3">
          {badge}
        </span>
      )}
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
        {title}{' '}
        {highlight && <span className="text-gradient-neon">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
