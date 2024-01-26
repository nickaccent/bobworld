import { Sky } from '@react-three/drei';

import React from 'react';

const SkyBox = ({ entityManager }) => {
  let yPos = 5;
  // if (entityManager.clockH >= 0 && entityManager.clockH < 5) {
  //   yPos = -15;
  // } else if (entityManager.clockH >= 21 && entityManager.clockH < 24) {
  //   yPos = -15;
  // } else if (entityManager.clockH === 5) {
  //   let secondMod = entityManager.clockM / 4;
  //   yPos = -15 + secondMod;
  // } else if (entityManager.clockH === 6) {
  //   let secondMod = entityManager.clockM / 12;
  //   yPos = 0 + secondMod;
  // } else if (entityManager.clockH === 19) {
  //   let secondMod = Math.floor(entityManager.clockM / 12);
  //   yPos = 5 - secondMod;
  // } else if (entityManager.clockH === 20) {
  //   let secondMod = Math.floor(entityManager.clockM / 4);
  //   yPos = 0 - secondMod;
  // } else {
  //   yPos = 5;
  // }

  let pos = [8, yPos, 8];
  return (
    <Sky
      distance={1000}
      sunPosition={[pos[0], pos[1], pos[2]]}
      inclination={0.6}
      azimuth={0.1}
      rayleigh={0.5}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
    />
  );
};

export default SkyBox;
