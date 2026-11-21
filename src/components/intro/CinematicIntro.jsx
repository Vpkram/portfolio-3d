import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import '@fontsource/anton';

// Lightweight 60fps canvas particles for drifting neon glow
function IntroParticles({ isMobile }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const count = isMobile ? 18 : 45;
    const colors = ['#00f0ff', '#38bdf8', '#a855f7', '#ffffff'];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.5 - 0.2, // Upward drift
      alpha: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * 0.04 + 0.015,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha += Math.sin(Date.now() * p.pulse * 0.05) * 0.008;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, p.alpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function CinematicIntro({ onComplete }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isExiting, setIsExiting] = useState(false);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax mapping: word shifts opposite to cursor, cutout moves with cursor
  const wordX = useTransform(smoothMouseX, [-1, 1], [26, -26]);
  const wordY = useTransform(smoothMouseY, [-1, 1], [14, -14]);

  const cutoutX = useTransform(smoothMouseX, [-1, 1], [-16, 16]);
  const cutoutY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  // Lock body scroll during intro and unlock when finished
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Mouse move parallax listener (desktop)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Handle escape key to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Strict 3.0s total timeline:
  // 2.4s: start smooth dissolve
  // 3.0s: end intro, reveal hero underneath
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2400);

    const completeTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('cinematic_intro_seen', 'true');
      } catch {}
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    try {
      sessionStorage.setItem('cinematic_intro_seen', 'true');
    } catch {}
    setTimeout(() => {
      onComplete();
    }, 220);
  };

  const letters = ['P', 'A', 'V', 'A', 'N'];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
    >
      {/* Drifting Neon Particles */}
      <IntroParticles isMobile={isMobile} />

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        onClick={handleSkip}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-40 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card border border-white/20 hover:border-neon-cyan/50 text-xs font-mono text-slate-300 hover:text-white hover:bg-neon-cyan/10 transition-all cursor-pointer shadow-lg"
        aria-label="Skip Intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>

      {/* 1.4 - 2.2s: Small Corner Labels fading in at screen edges */}
      {/* Top Left: ML ENGINEER */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: isExiting ? 0 : 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 pointer-events-none flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-slate-300 uppercase px-3 py-1 rounded-full glass-card border border-white/10">
          ML ENGINEER
        </span>
      </motion.div>

      {/* Bottom Left: GEN AI */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: isExiting ? 0 : 1, x: 0 }}
        transition={{ delay: 1.45, duration: 0.6 }}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-slate-400 uppercase px-3 py-1 rounded-full glass-card border border-white/10">
          GEN AI
        </span>
      </motion.div>

      {/* Bottom Right: AGENTIC SYSTEMS */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: isExiting ? 0 : 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-slate-400 uppercase px-3 py-1 rounded-full glass-card border border-white/10">
          AGENTIC SYSTEMS
        </span>
      </motion.div>

      {/* Continuous Slow Camera Push-in (0 to 2.6s, scaling 1 to 1.06) + Zoom & Dissolve (2.4 to 3s) */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isExiting ? 1.10 : 1.06 }}
        transition={{
          duration: isExiting ? 0.6 : 2.6,
          ease: isExiting ? 'easeIn' : 'linear',
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 0.5 - 1.4s: Huge bold condensed PAVAN in Anton font + WELCOME TO MY WORLD BEHIND cutout (z-10) */}
        <motion.div
          style={{ x: wordX, y: wordY }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-2 sm:px-4"
        >
          {/* 1.4 - 2.2s: "WELCOME TO MY WORLD" fades in above */}
          <motion.p
            initial={{ opacity: 0, y: 10, letterSpacing: '0.35em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.55em' }}
            transition={{ delay: 1.4, duration: 0.7, ease: 'easeOut' }}
            className="font-mono text-xs sm:text-sm md:text-base text-neon-cyan uppercase text-center mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
          >
            WELCOME TO MY WORLD
          </motion.p>

          {/* Huge PAVAN: spans nearly full width & ~55% screen height in Anton font */}
          <div className="relative inline-flex items-center justify-center overflow-hidden max-w-[98vw] max-h-[58vh]">
            <div
              className="flex items-center justify-center font-anton uppercase tracking-tight leading-[0.8] text-[clamp(6rem,25vw,55vh)]"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{
                    scale: 1.4,
                    filter: 'blur(20px)',
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    filter: 'blur(0px)',
                    opacity: 1,
                  }}
                  transition={{
                    delay: 0.5 + i * 0.05, // Staggered slam: 0.50, 0.55, 0.60, 0.65, 0.70s
                    duration: 0.45,
                    ease: [0.16, 1, 0.3, 1], // Slam ease-out
                  }}
                  className="inline-block bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent select-none drop-shadow-[0_0_40px_rgba(0,240,255,0.45)]"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Light sweep glides across the letters */}
            <motion.div
              initial={{ x: '-160%', opacity: 0 }}
              animate={{ x: '180%', opacity: [0, 0.9, 0.9, 0] }}
              transition={{ delay: 0.85, duration: 0.65, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-white/85 to-transparent skew-x-[-22deg] pointer-events-none mix-blend-overlay"
            />
          </div>
        </motion.div>

        {/* 0 to 0.8s: Cutout reveals from feet upward (bottom-to-top mask), scaling 0.92 to 1 (z-20) */}
        {/* Height: ~90% viewport height, centered, feet planted on bottom edge */}
        <motion.div
          style={{ x: cutoutX, y: cutoutY, transformOrigin: 'bottom center' }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center h-[90vh] max-h-[90vh] pointer-events-none"
        >
          <motion.div
            initial={{
              clipPath: 'inset(100% 0% 0% 0%)',
              scale: 0.92,
              opacity: 0,
            }}
            animate={{
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1], // easeOutCubic
            }}
            style={{ transformOrigin: 'bottom center' }}
            className="h-full flex items-end justify-center"
          >
            <img
              src="/me-cutout.png"
              alt="Pavan Kalyan Ram Vanama"
              width="433"
              height="576"
              className="h-full w-auto max-w-[95vw] object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] select-none"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtle bottom edge blend */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30" />
    </motion.div>
  );
}
