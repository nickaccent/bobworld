import React, { Suspense, useEffect, useRef, useContext } from 'react';
import HashGrid from '../classes/HashGrid';
import SoundManager from '../classes/SoundManager';
import * as PF from 'pathfinding';

import GUI from './GUI';
import Environment from './Environment';
import StartGUI from './StartGUI';
import LoadGUI from './LoadGUI';
import { GUIContext } from '../contexts/GUI';
import { EntityManagerContext } from '../contexts/EntityManager';
import { HashGridContext } from '../contexts/HashGrid';
import { PathFindingGridContext } from '../contexts/PathFindingGrid';
import { SoundManagerContext } from '../contexts/SoundManager';

const Game = () => {
  const { load, start, setLoading, loading } = useContext(GUIContext);
  const { entityManager } = useContext(EntityManagerContext);
  const { setHashGrid } = useContext(HashGridContext);
  const { setPathFindingGrid } = useContext(PathFindingGridContext);
  const { setSoundManager } = useContext(SoundManagerContext);

  useEffect(() => {
    if (loading === true) {
      const width = 11;
      const depth = 11;
      let soundManager = new SoundManager();
      setSoundManager(soundManager);
      const dimensions = [depth, width];
      let gridCellArray = [];
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < depth; y++) {
          let k = `${x}.${y}`;
          gridCellArray.push({
            key: k,
            x,
            y,
            type: 'EMPTY',
            set: [],
            DistanceTo(tile) {
              return Math.abs(this.x - tile.x) + Math.abs(this.y - tile.y);
            },
          });
        }
      }
      const hashGrid = new HashGrid(dimensions, gridCellArray);
      entityManager.hashGrid = hashGrid;
      entityManager.width = width;
      entityManager.depth = depth;
      entityManager.w = width;
      entityManager.d = depth;
      entityManager.soundManager = soundManager;
      setHashGrid(hashGrid);

      // set vehicle path grid
      let vPfGrid = new PF.Grid(width, depth);
      for (let y = 0; y < depth; y++) {
        for (let x = 0; x < width; x++) {
          vPfGrid.setWalkableAt(x, y, false);
        }
      }
      entityManager.roadsGrid = vPfGrid;

      // set grid for general object placement
      let pfGrid = new PF.Grid(width, depth);
      setPathFindingGrid(pfGrid);
      entityManager.initialized = true;
    }
  }, []);

  useEffect(() => {
    if (entityManager.initialized === true) {
      setLoading(false);
    }
    // setDebug(true);
  }, [entityManager]);

  return (
    <>
      {start === true ? (
        <>
          <Environment />
          <GUI />
        </>
      ) : load === true ? (
        <LoadGUI />
      ) : (
        <StartGUI />
      )}
    </>
  );
};

export default Game;
