import React, { Suspense, lazy, useEffect, useRef, useContext } from 'react';
import HashGrid from '../classes/HashGrid';
import SoundManager from '../classes/SoundManager';

import GUI from './GUI';
import StartGUI from './StartGUI';
import LoadGUI from './LoadGUI';
import ErrorBoundary from './ErrorBoundary';

const Environment = lazy(() => import('./Environment'));
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
    if (loading !== true) return;
    let cancelled = false;
    (async () => {
      const PF = await import('pathfinding');
      if (cancelled) return;
      const width = 11;
      const depth = 11;
      const soundManager = new SoundManager();
      setSoundManager(soundManager);
      const dimensions = [depth, width];
      const gridCellArray = [];
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < depth; y++) {
          gridCellArray.push({
            key: `${x}.${y}`,
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

      const vPfGrid = new PF.Grid(width, depth);
      for (let y = 0; y < depth; y++) {
        for (let x = 0; x < width; x++) {
          vPfGrid.setWalkableAt(x, y, false);
        }
      }
      entityManager.roadsGrid = vPfGrid;

      const pfGrid = new PF.Grid(width, depth);
      setPathFindingGrid(pfGrid);
      entityManager.initialized = true;
    })();
    return () => {
      cancelled = true;
    };
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
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Environment />
            <GUI />
          </Suspense>
        </ErrorBoundary>
      ) : load === true ? (
        <LoadGUI />
      ) : (
        <StartGUI />
      )}
    </>
  );
};

export default Game;
