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
    <>
      <Canvas shadows>
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
                LEFT: 'ArrowLeft', //left arrow
                UP: 'ArrowUp', // up arrow
                RIGHT: 'ArrowRight', // right arrow
                BOTTOM: 'ArrowDown', // down arrow
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
            {/* <SkyBox entityManager={storeEntityManager} /> */}
          </PerformanceMonitor>
          <Perf position="top-left" showGraph={false} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default Environment;
