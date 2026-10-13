import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function ParticleCloud({ count = 280, isMobile = false }) {
  const pointsRef = useRef();
  const secondaryRef = useRef();

  const [positions, secondaryPositions] = useMemo(() => {
    const pos1 = new Float32Array(count * 3);
    const count2 = Math.floor(count * 0.35);
    const pos2 = new Float32Array(count2 * 3);

    // Keep particles predominantly on the left (x < 0.2), away from the face/body on the right
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos1[i3] = -6.5 + Math.random() * 6.5;
      pos1[i3 + 1] = (Math.random() - 0.5) * 8.5;
      pos1[i3 + 2] = -1.5 + (Math.random() - 0.5) * 4;
    }

    for (let i = 0; i < count2; i++) {
      const i3 = i * 3;
      pos2[i3] = -6.8 + Math.random() * 6.2;
      pos2[i3 + 1] = (Math.random() - 0.5) * 8.0;
      pos2[i3 + 2] = -2.0 + (Math.random() - 0.5) * 4;
    }

    return [pos1, pos2];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      if (!isMobile) {
        pointsRef.current.position.x = THREE.MathUtils.lerp(
          pointsRef.current.position.x,
          state.pointer.x * 0.2,
          0.03
        );
        pointsRef.current.position.y = THREE.MathUtils.lerp(
          pointsRef.current.position.y,
          state.pointer.y * 0.15,
          0.03
        );
      }
    }

    if (secondaryRef.current) {
      secondaryRef.current.rotation.y -= delta * 0.015;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={isMobile ? 0.022 : 0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={isMobile ? 0.25 : 0.32}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <Points
        ref={secondaryRef}
        positions={secondaryPositions}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#a855f7"
          size={isMobile ? 0.025 : 0.022}
          sizeAttenuation
          depthWrite={false}
          opacity={isMobile ? 0.18 : 0.24}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Wireframe shapes only on desktop to save mobile GPU cycles */}
      {!isMobile && (
        <>
          <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.4}>
            <mesh position={[-4.5, 2.2, -2.5]}>
              <icosahedronGeometry args={[0.5, 1]} />
              <meshBasicMaterial
                color="#00f0ff"
                wireframe
                transparent
                opacity={0.05}
              />
            </mesh>
          </Float>

          <Float speed={1.0} rotationIntensity={0.3} floatIntensity={0.4}>
            <mesh position={[-4.0, -2.4, -2.8]}>
              <octahedronGeometry args={[0.45, 1]} />
              <meshBasicMaterial
                color="#a855f7"
                wireframe
                transparent
                opacity={0.05}
              />
            </mesh>
          </Float>
        </>
      )}
    </group>
  );
}

export default function HeroParticles({ isMobile = false }) {
  const particleCount = isMobile ? 65 : 280;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, transparent 58%)',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, transparent 58%)',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.25]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
      >
        <ParticleCloud count={particleCount} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
