import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

const COLOR_DAY = new THREE.Color(0xffffff);
const COLOR_DUSK = new THREE.Color(0xff8c4a);
const SUN_RADIUS = 20;
const SUN_Z = 18;

const _color = new THREE.Color();

const Lights = ({ entityManager }) => {
  const dirRef = useRef();
  const ambRef = useRef();
  const [sunPos, setSunPos] = useState(() => [SUN_RADIUS, SUN_RADIUS, SUN_Z]);
  const lastTick = useRef(-1);

  useFrame(() => {
    const h = entityManager?.clockH ?? 12;
    const m = entityManager?.clockM ?? 0;
    // Quantize to 5-minute game ticks so Sky re-renders ~12x per game day instead of every frame.
    const tick = h * 12 + Math.floor(m / 5);
    if (tick === lastTick.current) return;
    lastTick.current = tick;

    const t = (h + m / 60) / 24;
    const sunAngle = (t - 0.25) * Math.PI * 2;
    const sunHeight = Math.sin(sunAngle);
    const x = Math.cos(sunAngle) * SUN_RADIUS;
    const y = sunHeight * SUN_RADIUS;
    setSunPos([x, Math.max(y, 0.05), SUN_Z]);

    const above = Math.max(0, sunHeight);
    // Noon (above=1) preserved at dirInt 2.3, ambInt 0.8 — looks good.
    // Night floor (above=0) raised so the scene reads at midnight.
    const dirInt = 0.9 + above * 1.4;
    const ambInt = 0.6 + above * 0.2;
    const warmth = 1 - above;
    _color.copy(COLOR_DAY).lerp(COLOR_DUSK, warmth * 0.5);

    if (dirRef.current) {
      dirRef.current.intensity = dirInt;
      dirRef.current.color.copy(_color);
      dirRef.current.position.set(x, Math.max(y, 0.05), SUN_Z);
    }
    if (ambRef.current) {
      ambRef.current.intensity = ambInt;
    }
  });

  return (
    <>
      <Sky
        distance={450}
        sunPosition={sunPos}
        turbidity={6}
        rayleigh={1}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      <directionalLight
        ref={dirRef}
        position={[SUN_RADIUS, SUN_RADIUS, SUN_Z]}
        castShadow
        intensity={3.0}
        shadow-mapSize={2048}
        shadow-bias={-0.0008}
      >
        <orthographicCamera attach="shadow-camera" args={[-18, 18, 18, -18, 0.1, 60]} />
      </directionalLight>
      <ambientLight ref={ambRef} intensity={1.2} />
    </>
  );
};

export default Lights;
