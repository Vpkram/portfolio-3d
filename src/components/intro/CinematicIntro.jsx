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

  // Requirement 2: Check if browser can play VP9 WebM alpha
  const [canPlayVp9, setCanPlayVp9] = useState(() => {
    if (typeof document !== 'undefined') {
      const v = document.createElement('video');
      const support = v.canPlayType('video/webm; codecs="vp9"');
      return support === 'probably' || support === 'maybe';
    }
    return false;
  });

  // Connection check for slow mobile fallback
  const [isSlowConn, setIsSlowConn] = useState(false);
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const conn = navigator.connection;
      if (conn.saveData || ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) {
        setIsSlowConn(true);
      }
    }
  }, []);

  // Video playback readiness & element ref
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  const shouldPlayVideo = canPlayVp9 && !prefersReducedMotion && !isSlowConn;

  // Auto-play the transparent walking video with try/catch fallback to cutout
  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('VP9 alpha playback failed, falling back to trimmed cutout:', err);
          setCanPlayVp9(false);
        });
      }
    }
  }, [shouldPlayVideo]);

  const [pointerEvents, setPointerEvents] = useState('auto');
  const [isVisible, setIsVisible] = useState(true);

  // Parallax motion values (desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Requirement 4: Real motion on "RAM"
  // Cursor parallax in opposite direction of cursor (up to 25px horizontal, 12px vertical)
  const wordParallaxX = useTransform(smoothMouseX, [-1, 1], [25, -25]);
  const wordParallaxY = useTransform(smoothMouseY, [-1, 1], [12, -12]);

  // Requirement 4: Body moves 6px with cursor in opposite direction from letters (to give depth)
  const bodyParallaxX = useTransform(smoothMouseX, [-1, 1], [-6, 6]);
  const bodyParallaxY = useTransform(smoothMouseY, [-1, 1], [-3, 3]);

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
    <div
      style={{
        pointerEvents,
        display: isVisible ? 'block' : 'none',
      }}
      className="absolute inset-0 z-10 overflow-hidden select-none"
    >
      {/* Background backdrop element */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-black pointer-events-none -z-10"
      />

      {/* Drifting Warm Amber/Orange Particles */}
      <IntroParticles isMobile={isMobile} />

      {/* Requirement 3: "WELCOME TO MY WORLD" at about 14% from top, above my head,
          bold white with the dots, never overlapping me */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
        className="absolute top-[14%] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center px-4"
      >
        <p
          className="font-bold text-white text-[1.1rem] tracking-[0.35em] uppercase flex items-center justify-center gap-3 select-none whitespace-nowrap"
          style={{ fontWeight: 700, letterSpacing: '0.35em', fontSize: '1.1rem' }}
        >
          <span className="opacity-60 text-[0.8em] tracking-[0.25em]">• • •</span>
          <span>WELCOME TO MY WORLD</span>
          <span className="opacity-60 text-[0.8em] tracking-[0.25em]">• • •</span>
        </p>
      </motion.div>

      {/* Small Corner Labels */}
      {/* Top Left: ML ENGINEER */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
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
        transition={{ delay: 0.5, duration: 0.6 }}
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
        transition={{ delay: 0.55, duration: 0.6 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 pointer-events-none"
      >
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-amber-300/80 uppercase px-3 py-1 rounded-full glass-card border border-orange-500/30 bg-orange-950/30 shadow-[0_0_15px_rgba(255,110,0,0.2)]">
          AGENTIC SYSTEMS
        </span>
      </motion.div>

      {/* Requirement 3 & 4: "RAM" about 55% of viewport height, tight letters, centered at 50% width and about 56% down the screen.
          Real motion: visible horizontal drift 30px back and forth over 10s, cursor parallax up to 25px/12px opposite cursor,
          light sweep every 4s, letters never change size (z-10, behind body). */}
      <motion.div
        style={{
          x: wordParallaxX,
          y: wordParallaxY,
          scale: scrollWordScale,
          opacity: scrollWordOpacity,
          filter: wordFilter,
        }}
        className="absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center"
      >
        {/* Horizontal drift of 30px back and forth over 10 seconds */}
        <motion.div
          animate={
            prefersReducedMotion
              ? false
              : {
                  x: [-30, 30, -30],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative inline-flex items-center justify-center select-none"
        >
          {/* Soft orange radial ambient glow behind RAM */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[85vw] h-[55vh] bg-[radial-gradient(ellipse_at_center,rgba(255,110,0,0.22)_0%,transparent_70%)] blur-2xl" />
          </div>

          {/* Single "RAM" text element: about 55% viewport height, tight letters (-0.025em), orange gradient */}
          <span
            className="inline-block font-anton uppercase bg-gradient-to-b from-[#FF8A00] to-[#FF3D00] bg-clip-text text-transparent select-none drop-shadow-[0_0_50px_rgba(255,100,0,0.55)] leading-[0.82]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(6rem, 28vw, 55vh)',
              letterSpacing: '-0.025em',
              display: 'inline-block',
            }}
          >
            RAM
          </span>

          {/* Light sweep every 4 seconds (1.1s sweep + 2.9s delay) */}
          <motion.div
            initial={prefersReducedMotion ? false : { x: '-160%', opacity: 0 }}
            animate={
              prefersReducedMotion
                ? false
                : {
                    x: ['-160%', '180%'],
                    opacity: [0, 0.9, 0.9, 0],
                  }
            }
            transition={{
              duration: 1.1,
              repeat: Infinity,
              repeatDelay: 2.9,
              ease: 'easeInOut',
            }}
            className="absolute inset-y-0 w-2/5 bg-gradient-to-r from-transparent via-amber-200/85 to-transparent skew-x-[-22deg] pointer-events-none mix-blend-overlay"
          />
        </motion.div>
      </motion.div>

      {/* Requirement 2 & 3: Transparent walking video (intro-walk-alpha.webm), normal opaque-where-visible video,
          NO mix-blend-mode and NO mask. Solid body in front of RAM (z-20).
          Layout: body about 72% viewport height, feet at bottom edge, head about 28% from top, centered at 50%.
          Parallax: moves 6px with cursor in opposite direction from letters. */}
      <motion.div
        style={{
          x: bodyParallaxX,
          y: bodyParallaxY,
          scale: scrollCutoutScale,
          opacity: scrollCutoutOpacity,
          transformOrigin: 'bottom center',
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-end h-[72vh] max-h-[72vh] pointer-events-none"
      >
        {/* Transparent WebM Video (NO mix-blend-mode, NO mask) */}
        {shouldPlayVideo && (
          <video
            ref={videoRef}
            src="/intro-walk-alpha.webm"
            poster="/me-cutout-trimmed.png"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoReady(true)}
            onPlaying={() => setIsVideoReady(true)}
            className={`h-full w-auto max-w-[95vw] object-contain object-bottom pointer-events-none select-none transition-opacity duration-300 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Fallback image (if VP9 alpha unsupported, while video loads, slow connection, or prefers-reduced-motion) */}
        {(!shouldPlayVideo || !isVideoReady) && (
          <img
            src="/me-cutout-trimmed.png"
            alt="Pavan Kalyan Ram Vanama"
            width="310"
            height="894"
            className={`h-full w-auto max-w-[95vw] object-contain object-bottom pointer-events-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] ${
              shouldPlayVideo && isVideoReady ? 'hidden' : 'block'
            }`}
            loading="eager"
          />
        )}
      </motion.div>

      {/* Animated SCROLL indicator at bottom center (z-30) */}
      <motion.div
        style={{ opacity: scrollUiOpacity }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
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
    </div>
  );
}
