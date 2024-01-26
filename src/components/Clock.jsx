import React, { useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { ClockContext } from '../contexts/Clock';

const Clock = ({ entityManager }) => {
  const { setClockH, clockH, setClockM, clockM, setDelta } = useContext(ClockContext);
  useFrame((state, delta) => {
    if (entityManager.elapsedTimeLoad === true) {
      state.clock.elapsedTime = entityManager.elapsedTime;
      entityManager.elapsedTimeLoad = false;
    }
    let daySeconds = entityManager.days * 300;
    let currentDayTime = state.clock.elapsedTime - daySeconds;
    if (currentDayTime > 300) {
      entityManager.days += 1;
      currentDayTime = 0;
    }
    let hours = Math.floor(currentDayTime / 12.5);
    let mins = currentDayTime / 0.2083333;
    mins = mins - hours * 60;
    if (mins === 60) {
      mins = 0;
    }

    if (`${hours}:${Math.floor(mins)}` !== `${clockH}:${clockM}`) {
      entityManager.clockH = hours;
      entityManager.clockM = Math.floor(mins);
      entityManager.elapsedTime = state.clock.elapsedTime;
      setClockH(hours);
      setClockM(Math.floor(mins));
      setDelta(delta);
    }
  });
  return null;
};

export default Clock;
