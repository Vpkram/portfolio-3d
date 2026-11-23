import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDownRight, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const HeroParticles = lazy(() => import('../three/HeroParticles'));

const TARGET_ROLE_TEXT = 'Generative AI | Agentic AI | ML';

export default function Hero() {
  const { personal } = portfolioData;
  const heroRef = useRef(null);
  const imgRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTouchDevice = useMediaQuery('(hover: none), (pointer: coarse)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [maxPanY, setMaxPanY] = useState(0);

  // Motion values for smooth tracking
  const yMotion = useMotionValue(0);
  const xMotion = useMotionValue(0);

  // useSpring provides silky smooth gliding with zero sudden jumps
  const smoothY = useSpring(yMotion, { stiffness: 55, damping: 24, mass: 0.6 });
  const smoothX = useSpring(xMotion, { stiffness: 55, damping: 24, mass: 0.6 });

  // Refs for tracking touch & idle motion on touch devices
  const isTouchingRef = useRef(false);
  const lastTouchYRef = useRef(0);
  const touchDirectionRef = useRef(1); // 1 = moving down (toward shoes), -1 = moving up (toward face)
  const phaseRef = useRef(0); // Phase in ms [0, 20000] for slow 10s auto-pan loop

  // Calculate maximum vertical pan distance so shoes are reached at bottom
  const calculatePanDistance = () => {
    if (imgRef.current) {
      const imgHeight = imgRef.current.offsetHeight;
      const winHeight = window.innerHeight;
      const distance = Math.max(0, imgHeight - winHeight);
      setMaxPanY(distance);
    }
  };

  useEffect(() => {
    calculatePanDistance();
    window.addEventListener('resize', calculatePanDistance);
    return () => window.removeEventListener('resize', calculatePanDistance);
  }, []);

  // 1. DESKTOP ONLY: Map Cursor Y to Photo translateY (top = face, bottom = shoes) + subtle X parallax
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;

      const progressY = Math.max(0, Math.min(1, e.clientY / winHeight));
      yMotion.set(-progressY * maxPanY);

      const normX = (e.clientX / winWidth - 0.5) * 2;
      xMotion.set(normX * -12);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice, maxPanY, yMotion, xMotion]);

  // 2. TOUCH DEVICES ONLY: Touch & drag on hero moves photo vertically with finger Y (passive, no scroll blocking)
  useEffect(() => {
    if (!isTouchDevice) return;

    const heroEl = heroRef.current;
    if (!heroEl) return;

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        isTouchingRef.current = true;
        const touchY = e.touches[0].clientY;
        lastTouchYRef.current = touchY;

        const winHeight = window.innerHeight;
        const progressY = Math.max(0, Math.min(1, touchY / winHeight));
        yMotion.set(-progressY * maxPanY);
      }
    };

    const handleTouchMove = (e) => {
      if (isTouchingRef.current && e.touches && e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        touchDirectionRef.current = touchY >= lastTouchYRef.current ? 1 : -1;
        lastTouchYRef.current = touchY;

        const winHeight = window.innerHeight;
        const progressY = Math.max(0, Math.min(1, touchY / winHeight));
        yMotion.set(-progressY * maxPanY);
      }
    };

    const handleTouchEnd = () => {
      if (isTouchingRef.current) {
        isTouchingRef.current = false;
        // Synchronize auto-pan phase seamlessly with the release position
        const currentY = Math.abs(yMotion.get());
        const currentProgress = maxPanY > 0 ? Math.max(0, Math.min(1, currentY / maxPanY)) : 0;

        // progress = (1 - cos(theta)) / 2 => cos(theta) = 1 - 2 * progress
        const cosTheta = Math.max(-1, Math.min(1, 1 - 2 * currentProgress));
        const theta = Math.acos(cosTheta); // [0, PI]

        if (touchDirectionRef.current >= 0) {
          // Downward towards shoes: phase in [0, 10000]
          phaseRef.current = (theta / Math.PI) * 10000;
        } else {
          // Upward towards face: phase in [10000, 20000]
          phaseRef.current = 20000 - (theta / Math.PI) * 10000;
        }
      }
    };

    heroEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      heroEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isTouchDevice, maxPanY, yMotion]);

  // 3. TOUCH DEVICES ONLY: Idle auto-pan from face to shoes and back (~10s each way, ease-in-out)
  useEffect(() => {
    if (!isTouchDevice || prefersReducedMotion) return;

    let animId;
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = Math.min(now - lastTime, 100);
      lastTime = now;

      if (!isTouchingRef.current && maxPanY > 0) {
        phaseRef.current = (phaseRef.current + delta) % 20000;
        // Ease-in-out curve via cosine
        const theta = (phaseRef.current * Math.PI) / 10000;
        const progress = (1 - Math.cos(theta)) / 2;
        yMotion.set(-progress * maxPanY);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isTouchDevice, prefersReducedMotion, maxPanY, yMotion]);

  // 4. TOUCH DEVICES ONLY: Phone tilt horizontal shift (DeviceOrientation)
  useEffect(() => {
    if (!isTouchDevice) return;

    const handleOrientation = (e) => {
      if (e.gamma !== null && e.gamma !== undefined) {
        // gamma: left-to-right tilt degrees [-90, 90]
        const clampedGamma = Math.max(-25, Math.min(25, e.gamma));
        xMotion.set((clampedGamma / 25) * 12);
      }
    };

    let permissionRequested = false;

    const requestOrientation = () => {
      if (permissionRequested) return;
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        permissionRequested = true;
        DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          })
          .catch(() => {
            // Silently skip if denied or not permitted
          });
      }
    };

    // Standard Android / non-iOS browsers:
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission !== 'function'
    ) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    } else if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // iOS: request permission after user tap
      const handleUserTap = () => {
        requestOrientation();
      };
      window.addEventListener('touchend', handleUserTap, { passive: true, once: true });
      window.addEventListener('click', handleUserTap, { passive: true, once: true });
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [isTouchDevice, xMotion]);

  // Character-by-character typing of "Generative AI | Agentic AI | ML" once
  useEffect(() => {
    let index = 0;
    setTypedText('');
    setIsTypingComplete(false);

    const interval = setInterval(() => {
      index++;
      setTypedText(TARGET_ROLE_TEXT.slice(0, index));
      if (index >= TARGET_ROLE_TEXT.length) {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Direct resume download for public/resume.pdf
  const handleDownloadResume = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch('/resume.pdf');
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pavan_Kalyan_Ram_Vanama_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open('/resume.pdf', '_blank');
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[100svh] w-full flex items-center overflow-hidden bg-dark-950"
    >
      {/* BACKGROUND CONTAINER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Spring-Smoothed Motion Container */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : smoothY,
            x: prefersReducedMotion ? 0 : smoothX,
          }}
          className="absolute top-0 -left-[16px] w-[calc(100%+32px)] will-change-transform"
        >
          {/* Responsive Picture with WebP and PNG Fallback */}
          <picture className="w-full h-auto min-h-screen block">
            <source srcSet="/me.webp" type="image/webp" />
            <img
              ref={imgRef}
              src="/me.png"
              alt={personal.name}
              width="1087"
              height="1446"
              fetchPriority="high"
              onLoad={calculatePanDistance}
              className="w-full h-auto min-h-screen object-cover object-[78%_top] sm:object-right lg:object-[86%_center] block select-none"
              loading="eager"
            />
          </picture>
        </motion.div>

        {/* SOFT DARK GRADIENT (Behind text only on the far left; face and body stay completely bright) */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/70 via-[25%] to-transparent to-[45%] pointer-events-none z-[1]" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-dark-950/92 via-dark-950/60 via-[35%] to-transparent to-[65%] pointer-events-none z-[1]" />

        {/* Subtle Top & Bottom Edge Blends */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-dark-950/80 to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none z-[1]" />
      </div>

      {/* 3D PARTICLES OVERLAY */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-[2] pointer-events-none">
          <Suspense fallback={null}>
            <HeroParticles isMobile={isMobile} />
          </Suspense>
        </div>
      )}

      {/* FOREGROUND CONTENT (Mobile-optimized layout for 360px+) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16 lg:py-24">
        <div className="max-w-[90vw] xs:max-w-sm sm:max-w-2xl lg:max-w-3xl text-left">
          
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full glass-card border border-neon-blue/40 text-[11px] sm:text-sm font-mono text-neon-blue mb-5 sm:mb-6 shadow-neon-blue"
          >
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-ping" />
            <span>Machine Learning Engineer</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: 'easeOut' }}
            className="font-display font-extrabold text-3xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-[1.1] break-words"
          >
            Pavan Kalyan Ram{' '}
            <span className="text-gradient-neon block sm:inline">Vanama</span>
          </motion.h1>

          {/* Typing Line */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: 'easeOut' }}
            className="mt-4 sm:mt-5 mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-lg lg:text-2xl font-semibold text-slate-100 glass-card px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-neon-blue/30 backdrop-blur-md max-w-full overflow-hidden">
              <span className="text-neon-cyan select-none">&gt;</span>
              <span className="text-white tracking-wide truncate">{typedText}</span>
              <span
                className={`inline-block w-2 sm:w-2.5 h-4 sm:h-6 bg-neon-blue rounded-sm ml-0.5 shrink-0 ${
                  isTypingComplete ? 'animate-pulse' : 'opacity-100'
                }`}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.24, ease: 'easeOut' }}
            className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-dark-950 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple shadow-neon-blue hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <span>View Projects</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href="/resume.pdf"
              download="Pavan_Kalyan_Ram_Vanama_Resume.pdf"
              onClick={handleDownloadResume}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-white glass-card border border-neon-purple/50 hover:border-neon-blue/70 hover:shadow-neon-purple hover:scale-[1.02] active:scale-[0.99] transition-all group"
            >
              <Download className="w-4 h-4 text-neon-blue group-hover:translate-y-0.5 transition-transform" />
              <span>Download Resume</span>
            </a>
          </motion.div>

          {/* Quick Contact Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="mt-6 sm:mt-10 flex flex-wrap items-center gap-2 text-xs text-slate-300"
          >
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:text-neon-blue hover:border-neon-blue/50 transition-colors"
              title="Send Email"
            >
              <Mail className="w-3.5 h-3.5 text-neon-blue" />
              <span className="font-mono">{personal.email}</span>
            </a>

            <a
              href={`tel:+91${personal.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:text-neon-blue hover:border-neon-blue/50 transition-colors"
              title="Call Phone"
            >
              <Phone className="w-3.5 h-3.5 text-neon-purple" />
              <span className="font-mono">{personal.phoneFormatted}</span>
            </a>

            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:text-neon-blue hover:border-neon-blue/50 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5 text-neon-blue" />
              <span className="font-mono">{personal.githubDisplay}</span>
            </a>

            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card hover:text-neon-blue hover:border-neon-blue/50 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-neon-purple" />
              <span>LinkedIn</span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to About section"
        className="flex absolute bottom-24 right-8 z-20 flex-col items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 group-hover:text-orange-400 transition-colors">
          SCROLL
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-amber-400 group-hover:border-orange-400 transition-colors flex items-start justify-center pt-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-orange-400 transition-colors"
          />
        </div>
      </button>
    </section>
  );
}
