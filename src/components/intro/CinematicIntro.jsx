import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import '@fontsource/anton';

// Warm amber & orange drifting particles (Requirement 2 & 9)
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
    // Orange and warm amber palette
    const colors = ['#FF8A00', '#FFAE00', '#FF3D00', '#FFD580', '#FF6D00'];
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
        ctx.shadowBlur = 10;
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

export default function CinematicIntro({ scrollYProgress }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Requirement 8: Video hook for public/intro-walk.mp4
  const [hasVideo, setHasVideo] = useState(false);
  const [isArrived, setIsArrived] = useState(false);
  const [pointerEvents, setPointerEvents] = useState('auto');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch('/intro-walk.mp4', { method: 'HEAD' })
      .then((res) => {
        if (isMounted && res.ok && res.headers.get('content-type')?.includes('video')) {
          setHasVideo(true);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Parallax motion values (desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax mapping: RAM word shifts slightly opposite to cursor, cutout moves with cursor
  const wordParallaxX = useTransform(smoothMouseX, [-1, 1], [24, -24]);
  const wordParallaxY = useTransform(smoothMouseY, [-1, 1], [12, -12]);

  const cutoutParallaxX = useTransform(smoothMouseX, [-1, 1], [-14, 14]);
  const cutoutParallaxY = useTransform(smoothMouseY, [-1, 1], [-8, 8]);

  // Mousemove listener for parallax
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

  // Walking transition to idle breathing after ~3.0s
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsArrived(true);
      return;
    }
    const timer = setTimeout(() => {
      setIsArrived(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Scrubbed Scroll Transforms (scrubbed to scroll position over first 100vh)
  // Background opacity: 1 -> 0
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.25, 0]);

  // Cutout: scales up to about 1.35 and fades out
  const scrollCutoutScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const scrollCutoutOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 0.65, 0]);

  // "RAM": scales up to about 1.45, blurs out to 24px, and fades out
  const scrollWordScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const scrollWordBlur = useTransform(scrollYProgress, [0, 0.85], [0, 24]);
  const wordFilter = useTransform(scrollWordBlur, (b) => `blur(${b}px)`);
  const scrollWordOpacity = useTransform(scrollYProgress, [0, 0.65, 0.95], [1, 0.5, 0]);

  // Soft elliptical floor shadow fades on scroll
  const scrollShadowOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Corner labels, "WELCOME TO MY WORLD", and "SCROLL" indicator fade out quickly on scroll
  const scrollUiOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // Track scroll progress for pointer-events and visibility
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPointerEvents(v >= 0.85 ? 'none' : 'auto');
    setIsVisible(v < 0.999);
  });

  // Requirement 4: Walking motion keyframes (3.0s total, ~2 steps/sec = 6 steps)
  // Bounce: translateY ~6px
  const walkBounceKeyframes = [0, -6, 0, -6, 0, -6, 0, -6, 0, -6, 0, -6, 0];
  // Side sway: ~8px
  const walkSwayKeyframes = [0, 8, 0, -8, 0, 8, 0, -8, 0, 8, 0, -8, 0];
  // Tiny body tilt: ~1.5 degrees
  const walkTiltKeyframes = [0, 1.5, 0, -1.5, 0, 1.5, 0, -1.5, 0, 1.5, 0, -1.5, 0];

  // Shadow pulses in sync with footsteps
  const walkShadowScaleX = [0.75, 0.7, 0.82, 0.75, 0.87, 0.8, 0.92, 0.85, 0.97, 0.9, 1.02, 0.95, 1.0];
  const walkShadowOpacity = [0.55, 0.45, 0.65, 0.5, 0.7, 0.55, 0.75, 0.6, 0.8, 0.65, 0.85, 0.7, 0.85];

  const walkAnimProps = prefersReducedMotion
    ? { scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 }
    : {
        scale: [0.75, 1.0],
        opacity: [0.75, 1.0],
        y: walkBounceKeyframes,
        x: walkSwayKeyframes,
        rotate: walkTiltKeyframes,
        transition: {
          scale: { duration: 3.0, ease: [0.25, 0.1, 0.25, 1] },
          opacity: { duration: 3.0, ease: 'linear' },
          y: { duration: 3.0, ease: 'linear' },
          x: { duration: 3.0, ease: 'linear' },
          rotate: { duration: 3.0, ease: 'linear' },
        },
      };

  const idleAnimProps = prefersReducedMotion
    ? { scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 }
    : {
        scale: 1,
        opacity: 1,
        y: [0, -3.5, 0],
        x: [0, 2.5, 0, -2.5, 0],
        rotate: [0, 0.6, 0, -0.6, 0],
        transition: {
          y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 6.0, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 6.0, repeat: Infinity, ease: 'easeInOut' },
        },
      };

  const walkShadowProps = prefersReducedMotion
    ? { scaleX: 1, opacity: 0.85 }
    : {
        scaleX: walkShadowScaleX,
        opacity: walkShadowOpacity,
        transition: { duration: 3.0, ease: 'linear' },
      };

  const idleShadowProps = prefersReducedMotion
    ? { scaleX: 1, opacity: 0.85 }
    : {
        scaleX: [1, 1.05, 1],
        opacity: [0.85, 0.75, 0.85],
        transition: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
      };

  // Requirement 2: Big word "RAM"
  const letters = ['R', 'A', 'M'];

  return (
    <motion.div
      style={{
        opacity: bgOpacity,
        pointerEvents,
        display: isVisible ? 'flex' : 'none',
      }}
      className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Drifting Warm Amber/Orange Particles */}
      <IntroParticles isMobile={isMobile} />

      {/* Requirement 5: Small Corner Labels */}
      {/* Top Left: ML ENGINEER */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.35, duration: 0.6 }}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 pointer-events-none flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-ping" />
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-200/90 uppercase px-3 py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          ML ENGINEER
        </span>
      </motion.div>

      {/* Bottom Left: GEN AI */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-300/80 uppercase px-3 py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          GEN AI
        </span>
      </motion.div>

      {/* Bottom Right: AGENTIC SYSTEMS */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.45, duration: 0.6 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-300/80 uppercase px-3 py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          AGENTIC SYSTEMS
        </span>
      </motion.div>

      {/* Requirement 2 & 5: Big word "RAM" in Anton font + vertical orange gradient BEHIND cutout (z-10) */}
      <motion.div
        style={{
          x: wordParallaxX,
          y: wordParallaxY,
          scale: scrollWordScale,
          opacity: scrollWordOpacity,
          filter: wordFilter,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-2 sm:px-4"
      >
        {/* "WELCOME TO MY WORLD" fades in above "RAM" */}
        <motion.p
          style={{ opacity: scrollUiOpacity }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10, letterSpacing: '0.35em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.55em' }}
          transition={{ delay: 1.3, duration: 0.7, ease: 'easeOut' }}
          className="font-mono text-xs sm:text-sm md:text-base text-[#FFAE00] uppercase text-center mb-1 sm:mb-2 drop-shadow-[0_0_15px_rgba(255,174,0,0.6)] font-semibold"
        >
          WELCOME TO MY WORLD
        </motion.p>

        {/* Huge RAM: spans nearly full width & ~60% screen height in Anton font */}
        <div className="relative inline-flex items-center justify-center overflow-hidden max-w-[96vw] max-h-[60vh]">
          {/* Soft orange radial ambient glow behind RAM */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[85vw] h-[55vh] bg-[radial-gradient(ellipse_at_center,rgba(255,110,0,0.22)_0%,transparent_70%)] blur-2xl" />
          </div>

          <div
            className="flex items-center justify-center font-anton uppercase tracking-tight leading-[0.82] text-[clamp(7.5rem,30vw,60vh)]"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={
                  prefersReducedMotion
                    ? false
                    : {
                        scale: 1.4,
                        filter: 'blur(20px)',
                        opacity: 0,
                      }
                }
                animate={{
                  scale: 1,
                  filter: 'blur(0px)',
                  opacity: 1,
                }}
                transition={{
                  delay: prefersReducedMotion ? 0 : 0.45 + i * 0.08,
                  duration: 0.48,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block bg-gradient-to-b from-[#FF8A00] to-[#FF3D00] bg-clip-text text-transparent select-none drop-shadow-[0_0_45px_rgba(255,100,0,0.55)]"
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Light sweep glides across the letters */}
          <motion.div
            initial={prefersReducedMotion ? false : { x: '-160%', opacity: 0 }}
            animate={{ x: '180%', opacity: [0, 0.9, 0.9, 0] }}
            transition={{ delay: 0.85, duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-amber-200/85 to-transparent skew-x-[-22deg] pointer-events-none mix-blend-overlay"
          />
        </div>
      </motion.div>

      {/* Requirement 3, 4, 8: Cutout / Video Centered, Feet at Bottom, 90% Viewport Height (z-20) */}
      <motion.div
        style={{
          x: cutoutParallaxX,
          y: cutoutParallaxY,
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-end h-[90vh] max-h-[90vh] pointer-events-none"
      >
        {/* Soft elliptical floor shadow under feet pulsing in sync */}
        <motion.div
          style={{ opacity: scrollShadowOpacity }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        >
          <motion.div
            animate={isArrived ? idleShadowProps : walkShadowProps}
            className="w-48 sm:w-64 h-6 sm:h-8 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.4)_45%,_transparent_75%)]"
          />
        </motion.div>

        {/* Scroll scrub wrapper: scales up to ~1.35 and fades on scroll */}
        <motion.div
          style={{
            scale: scrollCutoutScale,
            opacity: scrollCutoutOpacity,
            transformOrigin: 'bottom center',
          }}
          className="h-full flex items-end justify-center z-20"
        >
          {/* Walking forward (0-3s) -> idle breathing sway wrapper */}
          <motion.div
            animate={isArrived ? idleAnimProps : walkAnimProps}
            style={{ transformOrigin: 'bottom center' }}
            className="h-full flex items-end justify-center"
          >
            {hasVideo ? (
              <video
                src="/intro-walk.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-auto max-w-[95vw] object-contain object-bottom select-none mix-blend-screen"
              />
            ) : (
              <img
                src="/me-cutout-trimmed.png"
                alt="Pavan Kalyan Ram Vanama"
                width="123"
                height="357"
                className="h-full w-auto max-w-[95vw] object-contain object-bottom select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                loading="eager"
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Requirement 5: Animated SCROLL indicator at bottom center */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1.5"
      >
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-400/90 font-medium uppercase drop-shadow-[0_0_10px_rgba(255,174,0,0.5)]">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-orange-500/50 flex items-start justify-center p-1 bg-orange-950/20 backdrop-blur-sm shadow-[0_0_12px_rgba(255,110,0,0.3)]"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] shadow-[0_0_6px_#FF8A00]"
          />
        </motion.div>
      </motion.div>

      {/* Subtle bottom edge blend */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30" />
    </motion.div>
  );
}
