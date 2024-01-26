import React, { useRef } from 'react';

const Lights = ({ entityManager }) => {
  const lightRef = useRef();
  let dIntensity = 1.0;
  let aIntensity = 0.5;

  // if (entityManager.clockH >= 0 && entityManager.clockH < 6) {
  //   dIntensity = 0.15;
  //   aIntensity = 0.075;
  // } else if (entityManager.clockH >= 20 && entityManager.clockH < 24) {
  //   dIntensity = 0.15;
  //   aIntensity = 0.075;
  // } else if (entityManager.clockH === 6) {
  //   let secondMod = entityManager.clockM * 1.678;
  //   let dIntensityMod = 0.0085 * secondMod;
  //   let aIntensityMod = 0.0043 * secondMod;
  //   dIntensity = 0.15 + dIntensityMod;
  //   aIntensity = 0.075 + aIntensityMod;
  // } else if (entityManager.clockH === 19) {
  //   let secondMod = entityManager.clockM * 1.678;
  //   let dIntensityMod = 0.0085 * secondMod;
  //   let aIntensityMod = 0.0043 * secondMod;
  //   dIntensity = 1.0 - dIntensityMod;
  //   aIntensity = 0.5 - aIntensityMod;
  // } else {
  //   dIntensity = 1.0;
  //   aIntensity = 0.5;
  // }

  return (
    <group ref={lightRef}>
      <directionalLight
        position={[8, 20, 18]}
        castShadow
        intensity={dIntensity}
        shadow-mapSize={2048}
        shadow-bias={-0.0008}
      >
        <orthographicCamera attach="shadow-camera" args={[-10.5, 10.5, 10.5, -10.5, 0.0, 30]} />
      </directionalLight>
      <ambientLight intensity={aIntensity} />
    </group>
  );
};

export default Lights;
