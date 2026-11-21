import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import '@fontsource/anton';

// Drifting particles (Requirement: keep intro accents)
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

  const shouldPlayVideo = !prefersReducedMotion && !isSlowConn;

  // Auto-play the walking video
  useEffect(() => {
    if (shouldPlayVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [shouldPlayVideo]);

  const [pointerEvents, setPointerEvents] = useState('auto');
  const [isVisible, setIsVisible] = useState(true);

  // Parallax motion values (desktop) - Cursor parallax on "RAM" only
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 45, damping: 22, mass: 0.7 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Cursor parallax shifts "RAM" slightly opposite to cursor
  const wordParallaxX = useTransform(smoothMouseX, [-1, 1], [14, -14]);
  const wordParallaxY = useTransform(smoothMouseY, [-1, 1], [8, -8]);

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
  // Background opacity: 1 -> 0 (applied to background backdrop sibling)
  const bgOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.25, 0]);

  // Video: base scale 1.53 up to 1.53 * 1.35 (~2.06) on scroll, fades out
  const videoScrollScale = useTransform(scrollYProgress, [0, 1], [1.53, 1.53 * 1.35]);
  const videoScrollOpacity = useTransform(scrollYProgress, [0, 0.6, 0.9], [1, 0.65, 0]);

  // Fallback cutout scroll transform
  const fallbackCutoutScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  // "RAM": scale 1 -> 1.45, blur 0 -> 24px, opacity 1 -> 0 on scroll
  const scrollWordScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const scrollWordBlur = useTransform(scrollYProgress, [0, 0.85], [0, 24]);
  const wordFilter = useTransform(scrollWordBlur, (b) => `blur(${b}px)`);
  const scrollWordOpacity = useTransform(scrollYProgress, [0, 0.65, 0.95], [1, 0.5, 0]);

  // Floor shadow opacity scrub
  const scrollShadowOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Corner labels, "WELCOME TO MY WORLD", and "SCROLL" indicator fade out quickly on scroll
  const scrollUiOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  // Track scroll progress for pointer-events and visibility
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setPointerEvents(v >= 0.85 ? 'none' : 'auto');
    setIsVisible(v < 0.999);
  });

  return (
    // Bug 2: The parent container has NO opacity < 1, NO transform, NO filter, NO isolation: isolate.
    // RAM and Video are direct siblings in the SAME stacking context so mix-blend-mode: screen blends seamlessly!
    <div
      style={{
        pointerEvents,
        display: isVisible ? 'block' : 'none',
      }}
      className="absolute inset-0 z-10 overflow-hidden select-none"
    >
      {/* Background backdrop element (sibling, not ancestor) */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-black pointer-events-none -z-10"
      />

      {/* Drifting Warm Amber/Orange Particles */}
      <IntroParticles isMobile={isMobile} />

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

      {/* SIBLING 1: "RAM" container (z-10), sitting directly underneath the video */}
      <motion.div
        style={{
          x: wordParallaxX,
          y: wordParallaxY,
          scale: scrollWordScale,
          opacity: scrollWordOpacity,
          filter: wordFilter,
        }}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-2"
      >
        {/* Bug 4: "WELCOME TO MY WORLD" - bold white line (font-weight 700, letter-spacing 0.35em, about 1.1rem),
            no orange, three small dots before and after it, centered directly above "RAM" */}
        <motion.div
          style={{ opacity: scrollUiOpacity }}
          className="text-center mb-2 sm:mb-4 select-none pointer-events-none"
        >
          <p
            className="font-bold text-white text-[1.1rem] tracking-[0.35em] uppercase flex items-center justify-center gap-3 select-none"
            style={{ fontWeight: 700, letterSpacing: '0.35em', fontSize: '1.1rem' }}
          >
            <span className="opacity-60 text-[0.8em] tracking-[0.25em]">• • •</span>
            <span>WELCOME TO MY WORLD</span>
            <span className="opacity-60 text-[0.8em] tracking-[0.25em]">• • •</span>
          </p>
        </motion.div>

        {/* Slow constant motion drift on "RAM" (20px back and forth over 8s, never changes size) */}
        <motion.div
          animate={
            prefersReducedMotion
              ? false
              : {
                  x: [-20, 20, -20],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative inline-flex items-center justify-center"
        >
          {/* Soft orange radial ambient glow behind RAM */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[85vw] h-[55vh] bg-[radial-gradient(ellipse_at_center,rgba(255,110,0,0.22)_0%,transparent_70%)] blur-2xl" />
          </div>

          {/* Bug 1: ONE text element containing "RAM", inline-block, centered, letter-spacing -0.02em,
              no scaleX, no word-spacing. Font size about 70% of viewport height. Three letters nearly touch. */}
          <span
            className="inline-block font-anton uppercase bg-gradient-to-b from-[#FF8A00] to-[#FF3D00] bg-clip-text text-transparent select-none drop-shadow-[0_0_50px_rgba(255,100,0,0.55)] leading-[0.82]"
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 'clamp(8rem, 36vw, 70vh)',
              letterSpacing: '-0.02em',
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

      {/* SIBLING 2: Video Element (z-20) - Sibling in the SAME stacking context as RAM!
          mix-blend-mode: screen on the video element itself blends directly with RAM behind it.
          Bug 3: Scaled so body is ~85% viewport height, feet at bottom edge, head ~12% from top, centered at 50% width.
          Measured exact transform: translate(-55.7%, 9.8%) scale(1.53) with transform-origin: bottom center. */}
      {shouldPlayVideo && (
        <motion.video
          ref={videoRef}
          src="/intro-walk.mp4"
          poster="/me-cutout-trimmed.png"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setIsVideoReady(true)}
          onPlaying={() => setIsVideoReady(true)}
          style={{
            mixBlendMode: 'screen',
            scale: videoScrollScale,
            opacity: videoScrollOpacity,
            x: '-55.7%',
            y: '9.8%',
            transformOrigin: 'bottom center',
            // Feathered soft radial mask on video only to avoid boundary box without darkening RAM
            maskImage: 'radial-gradient(ellipse 70% 85% at 50% 55%, black 45%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 85% at 50% 55%, black 45%, transparent 95%)',
          }}
          className={`absolute bottom-0 left-1/2 z-20 h-screen w-auto max-w-none object-contain object-bottom pointer-events-none select-none transition-opacity duration-300 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Fallback image (while video loads, on slow connections, or prefers-reduced-motion) */}
      {(!shouldPlayVideo || !isVideoReady) && (
        <motion.img
          src="/me-cutout-trimmed.png"
          alt="Pavan Kalyan Ram Vanama"
          width="310"
          height="894"
          style={{
            scale: fallbackCutoutScale,
            opacity: videoScrollOpacity,
            x: '-52.28%',
            transformOrigin: 'bottom center',
          }}
          className={`absolute bottom-0 left-1/2 z-20 h-[85vh] max-h-[85vh] w-auto max-w-[95vw] object-contain object-bottom pointer-events-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] ${
            shouldPlayVideo && isVideoReady ? 'hidden' : 'block'
          }`}
          loading="eager"
        />
      )}

      {/* SIBLING 3: Animated SCROLL indicator at bottom center (z-30) */}
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

      {/* Floor blend line */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-30" />
    </div>
  );
}
