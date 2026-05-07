import React, { useState, useContext, Suspense } from 'react';
import { useStore } from '../hooks/useStore';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EntityManagerContext } from '../contexts/EntityManager';
import Markers from './Markers';
import Roads from './Roads';
import TemporaryRoads from './TemporaryRoads';
import IndustrialBuildings from './IndustrialBuildings';
import CommercialBuildings from './CommercialBuildings';
import ResidentialBuildings from './ResidentialBuildings';
import People from './People';

const EMPTY = Object.freeze([]);

// Pre-warm every model the entity layer can mount, so the first instance of
// any type does not suspend and blank the parent <Suspense>.
[
  '/Models/newModels/Roads/deadEnd.glb',
  '/Models/newModels/Roads/straight.glb',
  '/Models/newModels/Roads/curve.glb',
  '/Models/newModels/Roads/threeway.glb',
  '/Models/newModels/Roads/fourway.glb',
  '/Models/newModels/Buildings/Residential/house_small1.glb',
  '/Models/newModels/Buildings/Commercial/shop1.glb',
  '/Models/newModels/Buildings/Industrial/factory1.glb',
  '/Models/newModels/People/bob.glb',
  '/Models/newModels/People/bobsimple.glb',
  '/Models/newModels/Vehicles/car.glb',
  '/Models/newModels/Vehicles/truck.glb',
  '/Models/newModels/Vehicles/hatchback.glb',
].forEach((p) => useGLTF.preload(p));

const EntityRenderer = () => {
  const [debug] = useStore((state) => [state.debug]);
  const { entityManager } = useContext(EntityManagerContext);
  const [buckets, setBuckets] = useState({
    roads: EMPTY,
    commercial: EMPTY,
    industrial: EMPTY,
    residential: EMPTY,
    people: EMPTY,
    temporaryRoads: EMPTY,
  });

  useFrame(() => {
    if (entityManager.requiresUpdate !== true) return;
    const next = {
      roads: [],
      commercial: [],
      industrial: [],
      residential: [],
      people: [],
      temporaryRoads: [],
    };
    for (const e of entityManager.entities) {
      switch (e.type) {
        case 'road':
          next.roads.push(e);
          break;
        case 'commercial':
          next.commercial.push(e);
          break;
        case 'industrial':
          next.industrial.push(e);
          break;
        case 'residential':
          next.residential.push(e);
          break;
        case 'person':
          if (e.visible === true) next.people.push(e);
          break;
      }
    }
    for (const e of entityManager.temporaryEntities) {
      if (e.type === 'road') next.temporaryRoads.push(e);
    }
    setBuckets(next);
    entityManager.requiresUpdate = false;
  });

  // Each typed bucket lives in its own <Suspense> so a late-loading model only
  // blanks its own subtree, never the entire 3D scene.
  return (
    <>
      <Suspense fallback={null}>
        <Roads roads={buckets.roads} />
      </Suspense>
      <Suspense fallback={null}>
        <TemporaryRoads temporaryRoads={buckets.temporaryRoads} />
      </Suspense>
      <Suspense fallback={null}>
        {buckets.industrial.length > 0 && <IndustrialBuildings buildings={buckets.industrial} />}
      </Suspense>
      <Suspense fallback={null}>
        {buckets.commercial.length > 0 && <CommercialBuildings buildings={buckets.commercial} />}
      </Suspense>
      <Suspense fallback={null}>
        {buckets.residential.length > 0 && <ResidentialBuildings buildings={buckets.residential} />}
      </Suspense>
      <Suspense fallback={null}>
        {buckets.people.length > 0 && <People people={buckets.people} />}
      </Suspense>
      {debug && <Markers entityManager={entityManager} />}
    </>
  );
};

export default EntityRenderer;
