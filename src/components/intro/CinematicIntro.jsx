import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import '@fontsource/anton';

// Drifting warm amber/orange particles
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
    const colors = ['#FF8A00', '#FFAE00', '#FF3D00', '#FFD580', '#FF6D00'];
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.5 - 0.2,
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

  // Requirement 3: Skip video ONLY for effectiveType "slow-2g" or "2g"
  const [isSlowConn, setIsSlowConn] = useState(false);
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const conn = navigator.connection;
      if (['slow-2g', '2g'].includes(conn.effectiveType)) {
        setIsSlowConn(true);
      }
    }
  }, []);

  // Requirement 3: Show still cutout ONLY if video element fires a real error event
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const shouldPlayVideo = !isSlowConn && !videoError;

  // Requirement 3: Call video.play() after mount
  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video play() note:', err);
        });
      }
    }
  }, [shouldPlayVideo]);

  const [pointerEvents, setPointerEvents] = useState('auto');
  const [isVisible, setIsVisible] = useState(true);

  // Requirement 2: Parallax offsets must start at exactly 0 and only change after mouse moves
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax offsets start at 0, opposite direction of cursor for RAM
  const wordParallaxX = useTransform(smoothMouseX, (v) => (hasMouseMoved ? v * -25 : 0));
  const wordParallaxY = useTransform(smoothMouseY, (v) => (hasMouseMoved ? v * -12 : 0));

  // Body moves at most 6px with cursor opposite to letters for depth
  const bodyParallaxX = useTransform(smoothMouseX, (v) => (hasMouseMoved ? v * 6 : 0));
  const bodyParallaxY = useTransform(smoothMouseY, (v) => (hasMouseMoved ? v * 3 : 0));

  // Mousemove listener for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setHasMouseMoved(true);
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scrubbed Scroll Transforms
  // Background opacity: 1 -> 0
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.25, 0]);

  // Video / Cutout: scales up to about 1.35 and fades out on scroll
  const scrollCutoutScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const scrollCutoutOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 0.65, 0]);

  // "RAM": scales up to about 1.45, blurs out to 24px, and fades out on scroll
  const scrollWordScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const scrollWordBlur = useTransform(scrollYProgress, [0, 0.85], [0, 24]);
  const wordFilter = useTransform(scrollWordBlur, (b) => `blur(${b}px)`);
  const scrollWordOpacity = useTransform(scrollYProgress, [0, 0.65, 0.95], [1, 0.5, 0]);

  // Corner labels, "WELCOME TO MY WORLD", and "SCROLL" indicator fade out quickly on scroll
  const scrollUiOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // Track scroll progress for pointer-events and visibility
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPointerEvents(v >= 0.85 ? 'none' : 'auto');
    setIsVisible(v < 0.999);
  });

  return (
    // One container: position relative, width 100%, height 100svh, overflow hidden, display grid, place-items center
    <div
      style={{
        pointerEvents,
        display: isVisible ? 'grid' : 'none',
      }}
      className="relative w-full h-[100svh] overflow-hidden select-none place-items-center z-10"
    >
      {/* Background backdrop element */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-black pointer-events-none -z-10"
      />

      {/* Drifting Warm Amber/Orange Particles */}
      <IntroParticles isMobile={isMobile} />

      {/* "WELCOME TO MY WORLD": horizontal center at 50% (within 4px), about 10-12% from the top */}
      <motion.div
        id="intro-welcome"
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
        className="absolute top-[8%] sm:top-[12%] left-0 right-0 mx-auto w-full max-w-full px-4 text-center z-30 pointer-events-none flex justify-center"
      >
        <p
          className="font-bold text-white uppercase flex items-center justify-center gap-1.5 sm:gap-3 select-none whitespace-nowrap text-[10px] tracking-[0.25em] sm:text-sm lg:text-[1.1rem] lg:tracking-[0.35em]"
          style={{ fontWeight: 700 }}
        >
          <span className="opacity-60 text-[0.8em] tracking-[0.2em] sm:tracking-[0.25em]">• • •</span>
          <span>WELCOME TO MY WORLD</span>
          <span className="opacity-60 text-[0.8em] tracking-[0.2em] sm:tracking-[0.25em]">• • •</span>
        </p>
      </motion.div>

      {/* Corner Labels: Top Left, Bottom Left, Bottom Right */}
      {/* Top Left: ML ENGINEER */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30 pointer-events-none flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-ping" />
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-200/90 uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          ML ENGINEER
        </span>
      </motion.div>

      {/* Bottom Left: GEN AI */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-300/80 uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          GEN AI
        </span>
      </motion.div>

      {/* Bottom Right: AGENTIC SYSTEMS */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-300/80 uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          AGENTIC SYSTEMS
        </span>
      </motion.div>

      {/* "RAM": one element, tight letters (letter-spacing -0.02em),
          bounding box centered horizontally at 50% of viewport width (within 4px),
          responsive font size, about 55% of viewport height tall on desktop.
          Both base and sweep layers share exact identical positioning and flex-centering. */}
      <motion.div
        id="intro-ram-wrapper"
        style={{
          x: wordParallaxX,
          y: wordParallaxY,
          scale: scrollWordScale,
          opacity: scrollWordOpacity,
          filter: wordFilter,
        }}
        className="absolute inset-x-0 top-[26svh] sm:top-[27.5vh] mx-auto w-full max-w-full px-4 text-center z-10 pointer-events-none select-none flex items-center justify-center h-[35svh] sm:h-[45vh] lg:h-[55vh]"
      >
        <div className="relative w-full h-full flex items-center justify-center select-none">
          {/* Soft orange radial ambient glow behind RAM */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[70vw] h-full bg-[radial-gradient(ellipse_at_center,rgba(255,110,0,0.22)_0%,transparent_70%)] blur-2xl" />
          </div>

          {/* Base "RAM" text: exact same positioning layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              id="intro-ram"
              className="font-anton uppercase bg-gradient-to-b from-[#FF8A00] to-[#FF3D00] bg-clip-text text-transparent select-none drop-shadow-[0_0_50px_rgba(255,100,0,0.55)] leading-none text-[34vw] sm:text-[26vw] lg:text-[55vh] tracking-[-0.02em] p-0 m-0"
              style={{
                fontFamily: "'Anton', sans-serif",
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              RAM
            </span>
          </div>

          {/* Light-sweep overlay RAM copy: exact same wrapper and coordinates */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <motion.span
              id="intro-ram-sweep"
              aria-hidden="true"
              className="font-anton uppercase bg-clip-text text-transparent select-none pointer-events-none leading-none text-[34vw] sm:text-[26vw] lg:text-[55vh] tracking-[-0.02em] p-0 m-0"
              style={{
                fontFamily: "'Anton', sans-serif",
                lineHeight: 1,
                letterSpacing: '-0.02em',
                backgroundImage:
                  'linear-gradient(110deg, transparent 25%, rgba(255, 235, 175, 0.95) 50%, transparent 75%)',
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
              animate={
                prefersReducedMotion
                  ? false
                  : {
                      backgroundPosition: ['200% 0', '-100% 0'],
                    }
              }
              transition={{
                duration: 1.1,
                repeat: Infinity,
                repeatDelay: 2.9,
                ease: 'easeInOut',
              }}
            >
              RAM
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Requirement 3: The walking video / photo:
          - Visible from the first frame
          - Centered horizontally over the RAM text
          - Sized responsively: h-[52svh] on mobile, h-[80vh] on desktop
          - Feet stay above the SCROLL button on mobile */}
      <motion.div
        id="intro-video-wrapper"
        style={{
          x: bodyParallaxX,
          y: bodyParallaxY,
          scale: scrollCutoutScale,
          opacity: scrollCutoutOpacity,
          transformOrigin: 'bottom center',
        }}
        className="absolute bottom-[16svh] sm:bottom-0 left-0 right-0 mx-auto w-fit z-20 flex flex-col items-center justify-end h-[52svh] sm:h-[65svh] lg:h-[80vh] max-h-[52svh] sm:max-h-[65svh] lg:max-h-[80vh] pointer-events-none"
      >
        {shouldPlayVideo ? (
          <video
            ref={videoRef}
            src="/intro-walk-alpha.webm"
            poster="/me-cutout-trimmed.png"
            autoPlay
            loop
            muted
            playsInline
            onError={() => {
              console.error('Walking video failed to load, falling back to cutout.');
              setVideoError(true);
            }}
            className="h-full w-auto max-w-[85vw] lg:max-w-[95vw] object-contain object-bottom pointer-events-none select-none"
          />
        ) : (
          <img
            src="/me-cutout-trimmed.png"
            alt="Pavan Kalyan Ram Vanama"
            width="310"
            height="894"
            className="h-full w-auto max-w-[85vw] lg:max-w-[95vw] object-contain object-bottom pointer-events-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            loading="eager"
          />
        )}
      </motion.div>

      {/* SCROLL indicator (positioned at bottom-16 on mobile above the AGENTIC SYSTEMS badge at bottom-4, bottom-24 on desktop) */}
      <motion.button
        id="intro-scroll-indicator"
        type="button"
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="Scroll to About section"
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex absolute bottom-16 sm:bottom-24 right-4 sm:right-8 z-30 flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer bg-transparent border-none p-0 pointer-events-auto"
      >
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 group-hover:text-orange-400 transition-colors drop-shadow-[0_0_8px_rgba(255,174,0,0.5)]">
          SCROLL
        </span>
        <div className="w-4 h-7 sm:w-5 sm:h-8 rounded-full border-2 border-amber-400 group-hover:border-orange-400 transition-colors flex items-start justify-center pt-1 bg-orange-950/20 backdrop-blur-sm shadow-[0_0_12px_rgba(255,110,0,0.3)]">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-400 group-hover:bg-orange-400 transition-colors shadow-[0_0_6px_#FF8A00]"
          />
        </div>
      </motion.button>
    </div>
  );
}