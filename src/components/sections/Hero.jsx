import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDownRight, Download, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { useMediaQuery, useIsSlowConnection } from '../../hooks/useMediaQuery';

const HeroParticles = lazy(() => import('../three/HeroParticles'));

const TARGET_ROLE_TEXT = 'Generative AI | Agentic AI | ML';

export default function Hero() {
  const { personal } = portfolioData;
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isSlowConnection = useIsSlowConnection();

  const [hasVideo, setHasVideo] = useState(false);
  const [isVideoPortrait, setIsVideoPortrait] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [maxPanY, setMaxPanY] = useState(0);

  // Motion values for smooth cursor tracking (only active when video is NOT present)
  const yMotion = useMotionValue(0);
  const xMotion = useMotionValue(0);

  // useSpring provides silky smooth gliding with zero sudden jumps
  const smoothY = useSpring(yMotion, { stiffness: 55, damping: 24, mass: 0.6 });
  const smoothX = useSpring(xMotion, { stiffness: 55, damping: 24, mass: 0.6 });

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

  // Map Cursor Y to Photo translateY (top = face, bottom = shoes) + subtle X parallax on desktop
  // Cursor pan is DISABLED when video is present
  useEffect(() => {
    if (hasVideo || isTouchDevice) return;

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
  }, [hasVideo, isTouchDevice, maxPanY, yMotion, xMotion]);

  // On touch devices, map vertical translation to scroll position (disabled when video is present)
  useEffect(() => {
    if (hasVideo || !isTouchDevice) return;

    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progressY = Math.max(0, Math.min(1, scrollY / (winHeight * 0.85)));
      yMotion.set(-progressY * maxPanY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasVideo, isTouchDevice, maxPanY, yMotion]);

  // Check if public/hero.mp4 exists; otherwise keep me.png background
  useEffect(() => {
    fetch('/hero.mp4', { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && (contentType.includes('video') || contentType.includes('octet-stream') || contentType === '')) {
          setHasVideo(true);
        } else {
          setHasVideo(false);
        }
      })
      .catch(() => setHasVideo(false));
  }, []);

  // Autoplay video once mounted
  useEffect(() => {
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [hasVideo]);

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

  const handleVideoMetadata = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setIsVideoPortrait(videoHeight >= videoWidth);
    }
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

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
      className="relative min-h-screen w-full flex items-center overflow-hidden bg-dark-950"
    >
      {/* BACKGROUND CONTAINER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {hasVideo && !isSlowConnection ? (
          /* HERO VIDEO BACKGROUND (object-cover, muted, autoplay, playsInline, holds last frame) */
          <div className="absolute inset-0 w-full h-full">
            {isVideoPortrait ? (
              /* Portrait or narrow video: placed on right side, large, left edge faded smoothly */
              <div className="absolute inset-0 flex items-center justify-end">
                <div
                  className="relative w-full h-full lg:w-[58%] xl:w-[52%] 2xl:w-[48%] overflow-hidden"
                  style={{
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, black 20%, black 100%)',
                    maskImage:
                      'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, black 20%, black 100%)',
                  }}
                >
                  <video
                    ref={videoRef}
                    poster="/me.png"
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={handleVideoMetadata}
                    onEnded={handleVideoEnded}
                    onError={() => setHasVideo(false)}
                    className="w-full h-full object-cover object-[75%_top] sm:object-right lg:object-center select-none"
                  >
                    <source src="/hero.mp4" type="video/mp4" />
                  </video>
                  {/* Left edge blend overlay fallback */}
                  <div className="hidden lg:block absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-dark-950 via-dark-950/70 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              /* Landscape or wide video: fills the full screen */
              <video
                ref={videoRef}
                poster="/me.png"
                autoPlay
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={handleVideoMetadata}
                onEnded={handleVideoEnded}
                onError={() => setHasVideo(false)}
                className="w-full h-full object-cover object-center select-none"
              >
                <source src="/hero.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        ) : (
          /* PHOTO FALLBACK with Spring-Smoothed Cursor Motion */
          <motion.div
            style={{
              y: prefersReducedMotion ? 0 : smoothY,
              x: prefersReducedMotion || isMobile ? 0 : smoothX,
            }}
            className="absolute top-0 -left-[12px] w-[calc(100%+24px)] will-change-transform"
          >
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
        )}

        {/* SOFT DARK GRADIENT (Behind text only on the left; face and body stay bright) */}
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

      {/* FOREGROUND CONTENT (Mobile-optimized layout for 375px+) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:py-24">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl text-left">
          
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
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-dark-950 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple shadow-neon-blue hover:scale-[1.02] active:scale-[0.99] transition-all"
            >
              <span>View Projects</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href="/resume.pdf"
              download="Pavan_Kalyan_Ram_Vanama_Resume.pdf"
              onClick={handleDownloadResume}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-display font-semibold text-sm sm:text-base text-white glass-card border border-neon-purple/50 hover:border-neon-blue/70 hover:shadow-neon-purple hover:scale-[1.02] active:scale-[0.99] transition-all group"
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
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300"
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
      <div className="hidden sm:flex absolute bottom-6 left-8 z-20 items-center gap-3 text-slate-400">
        <div className="w-4 h-7 rounded-full border border-neon-blue/40 flex items-start justify-center p-1">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-neon-blue"
          />
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Scroll Down</span>
      </div>
    </section>
  );
}
