import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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

    const count = isMobile ? 20 : 50;
    const colors = ['#00f5ff', '#a855f7', '#38bdf8', '#ffffff'];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15, // Upward drift
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
  const wordX = useTransform(smoothMouseX, [-1, 1], [30, -30]);
  const wordY = useTransform(smoothMouseY, [-1, 1], [16, -16]);

  const cutoutX = useTransform(smoothMouseX, [-1, 1], [-18, 18]);
  const cutoutY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

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

  // Automatic timeline transition (total ~5 seconds)
  useEffect(() => {
    // Begin fade-out at 4.15s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4150);

    // Complete and unmount at 5.0s
    const completeTimer = setTimeout(() => {
      try {
        sessionStorage.setItem('cinematic_intro_seen', 'true');
      } catch {}
      onComplete();
    }, 5050);

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
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 0.45 : 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
    >
      {/* 0-1s: Drifting Neon Particles */}
      <IntroParticles isMobile={isMobile} />

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        onClick={handleSkip}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-40 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-card border border-white/20 hover:border-neon-cyan/50 text-xs font-mono text-slate-300 hover:text-white hover:bg-neon-cyan/10 transition-all cursor-pointer shadow-lg"
        aria-label="Skip Intro"
      >
        <span>Skip</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </motion.button>

      {/* Ambient Radial Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none z-[5]" />

      {/* Content Staging Area */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* 2.5-4s: Giant Word "PAVAN" + "WELCOME TO MY WORLD" BEHIND the cutout (z-10) */}
        <motion.div
          style={{ x: wordX, y: wordY }}
          initial={{ opacity: 0, scale: 1.25, y: 35, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1.45,
            delay: 2.5,
            ease: [0.16, 1, 0.3, 1], // Cinematic easeOutExpo
          }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-4"
        >
          {/* Subtitle */}
          <p className="font-mono text-[10px] sm:text-xs md:text-sm text-cyan-300/80 tracking-[0.35em] sm:tracking-[0.55em] uppercase text-center mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(0,245,255,0.4)]">
            WELCOME TO MY WORLD
          </p>

          {/* Huge Condensed PAVAN */}
          <h1 className="font-display font-black text-[22vw] sm:text-[18vw] md:text-[16vw] leading-none uppercase tracking-tighter text-center bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(0,245,255,0.4)]">
            PAVAN
          </h1>
        </motion.div>

        {/* 1-2.5s: Centered Cutout fading in from feet upward (clip-path bottom-to-top) IN FRONT (z-20) */}
        <motion.div
          style={{ x: cutoutX, y: cutoutY }}
          className="relative z-20 flex items-end justify-center h-[72vh] sm:h-[80vh] md:h-[85vh] w-full pointer-events-none"
        >
          <motion.div
            initial={{
              clipPath: 'inset(100% 0% 0% 0%)',
              opacity: 0,
            }}
            animate={{
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
              delay: 1.0,
              ease: [0.22, 1, 0.36, 1], // easeOutCubic
            }}
            className="h-full flex items-end justify-center"
          >
            <img
              src="/me-cutout.png"
              alt="Pavan Kalyan Ram Vanama"
              width="433"
              height="576"
              className="h-full w-auto max-w-[85vw] object-contain object-bottom drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
              loading="eager"
            />
          </motion.div>
        </motion.div>

      </div>

      {/* Subtle bottom edge blend */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30" />
    </motion.div>
  );
}
