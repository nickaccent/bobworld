import { Suspense, useEffect, useRef, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls } from 'leva';
import { Perf } from 'r3f-perf';
import EntityRenderer from './EntityRenderer';
import Clock from './Clock';
import Camera from './Camera';
import Lights from './Lights';
import Ground from './Ground';
import SkyBox from './SkyBox';

import { useStore } from '../hooks/useStore';
import { EntityManagerContext } from '../contexts/EntityManager';

// WebGPU is opt-in via ?webgpu=1 query param.
// As of three r184 + R3F 9.6 + drei 10 + r3f-perf 7.2, WebGPURenderer's lifecycle
// races with R3F's render loop and r3f-perf's getContext() call crashes the canvas
// on WebGPU. The detect-and-use path stays here so a single flag flip enables it
// once the ecosystem catches up.
const wantsWebGPU =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('webgpu') === '1';

const createRenderer = async (props) => {
  if (wantsWebGPU && typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (adapter) {
        const { WebGPURenderer } = await import('three/webgpu');
        const r = new WebGPURenderer({ ...props, antialias: true });
        await r.init();
        return r;
      }
    } catch (e) {
      console.warn('[bobworld] WebGPU unavailable, using WebGL:', e?.message || e);
    }
  }
  return new THREE.WebGLRenderer({ ...props, antialias: true });
};

const Environment = () => {
  const { entityManager } = useContext(EntityManagerContext);
  const controlsRef = useRef();
  const [setDebug] = useStore((state) => [state.setDebug]);

  const { debug } = useControls({
    debug: false,
  });

  useEffect(() => {
    setDebug(debug);
  }, [debug]);

  useEffect(() => {
    if (entityManager?.soundManager?.buffer.loaded === true) {
      entityManager?.soundManager?.playSound('bgmusic', true);
    }
  }, [entityManager?.soundManager?.buffer.loaded]);

  return (
    <Canvas
      shadows="soft"
      gl={createRenderer}
      onCreated={({ gl, scene }) => {
        if (gl.isWebGLRenderer) {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }
        scene.background = new THREE.Color('#87CEEB');
      }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor>
          <Camera position={[0, 6, 13]} fov={40} />
          <Lights entityManager={entityManager} />
          <OrbitControls
            mouseButtons={{
              LEFT: '',
              MIDDLE: '',
              RIGHT: THREE.MOUSE.ROTATE,
            }}
            keys={{
              LEFT: 'ArrowLeft',
              UP: 'ArrowUp',
              RIGHT: 'ArrowRight',
              BOTTOM: 'ArrowDown',
            }}
            minDistance={0}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2 + 2}
            keyEvents={true}
            ref={controlsRef}
          />
          <Ground />
          <EntityRenderer />
          <Clock entityManager={entityManager} />
        </PerformanceMonitor>
        <Perf position="top-left" showGraph={false} />
      </Suspense>
    </Canvas>
  );
};

export default Environment;
