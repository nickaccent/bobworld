import React, { useState, useContext } from 'react';
import { useStore } from '../hooks/useStore';
import { useFrame } from '@react-three/fiber';
import { EntityManagerContext } from '../contexts/EntityManager';
import Entity from './Entity';
import Markers from './Markers';
import BluePrint from './BluePrint';
import Roads from './Roads';
import TemporaryRoads from './TemporaryRoads';
import IndustrialBuildings from './IndustrialBuildings';
import CommercialBuildings from './CommercialBuildings';
import ResidentialBuildings from './ResidentialBuildings';
import People from './People';

const EntityRenderer = () => {
  // const [blueprintModel] = useStore((state) => [state.blueprintModel]);
  const [debug] = useStore((state) => [state.debug]);
  const { entityManager } = useContext(EntityManagerContext);
  const [entityManagerEntities, setEntityManagerEntities] = useState([]);
  const [commercialEntities, setCommercialEntities] = useState([]);
  const [industrialEntities, setIndustrialEntities] = useState([]);
  const [residentialEntities, setResidentialEntities] = useState([]);
  const [peopleEntities, setPeopleEntities] = useState([]);
  const [entityManagerTemporaryEntities, setEntityManagerTemporaryEntities] = useState([]);

  useFrame(() => {
    if (entityManager.requiresUpdate === true) {
      setPeopleEntities(
        entityManager.entities.filter(
          (entity) => entity.type === 'person' && entity.visible === true,
        ),
      );
      setCommercialEntities(
        entityManager.entities.filter((entity) => entity.type === 'commercial'),
      );
      setIndustrialEntities(
        entityManager.entities.filter((entity) => entity.type === 'industrial'),
      );
      setResidentialEntities(
        entityManager.entities.filter((entity) => entity.type === 'residential'),
      );
      setEntityManagerEntities(entityManager.entities);
      setEntityManagerTemporaryEntities(entityManager.temporaryEntities);
      entityManager.requiresUpdate = false;
    }
  });

  return (
    <>
      <Roads roads={entityManagerEntities.filter((entity) => entity.type === 'road')} />
      <TemporaryRoads
        temporaryRoads={entityManagerTemporaryEntities.filter((entity) => entity.type === 'road')}
      />
      {industrialEntities.length > 0 && <IndustrialBuildings buildings={industrialEntities} />}
      {commercialEntities.length > 0 && <CommercialBuildings buildings={commercialEntities} />}
      {residentialEntities.length > 0 && <ResidentialBuildings buildings={residentialEntities} />}
      {peopleEntities.length > 0 && <People people={peopleEntities} />}
      {debug && <Markers entityManager={entityManager} />}
      {/* {blueprintModel !== null ? <BluePrint /> : ''} */}
    </>
  );
};

export default EntityRenderer;
