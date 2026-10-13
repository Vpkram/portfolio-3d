import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function CursorGlow() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [pos, setPos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      aria-hidden="true"
      style={{
        background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, rgba(0, 240, 255, 0.07), rgba(168, 85, 247, 0.04) 40%, transparent 75%)`,
      }}
    />
  );
}
