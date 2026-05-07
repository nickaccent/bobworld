import React, { useState, useContext } from 'react';
import { useStore } from '../hooks/useStore';
import { useFrame } from '@react-three/fiber';
import { EntityManagerContext } from '../contexts/EntityManager';
import Markers from './Markers';
import Roads from './Roads';
import TemporaryRoads from './TemporaryRoads';
import IndustrialBuildings from './IndustrialBuildings';
import CommercialBuildings from './CommercialBuildings';
import ResidentialBuildings from './ResidentialBuildings';
import People from './People';

const EMPTY = Object.freeze([]);

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

  return (
    <>
      <Roads roads={buckets.roads} />
      <TemporaryRoads temporaryRoads={buckets.temporaryRoads} />
      {buckets.industrial.length > 0 && <IndustrialBuildings buildings={buckets.industrial} />}
      {buckets.commercial.length > 0 && <CommercialBuildings buildings={buckets.commercial} />}
      {buckets.residential.length > 0 && <ResidentialBuildings buildings={buckets.residential} />}
      {buckets.people.length > 0 && <People people={buckets.people} />}
      {debug && <Markers entityManager={entityManager} />}
    </>
  );
};

export default EntityRenderer;
