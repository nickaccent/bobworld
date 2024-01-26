import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const Building = ({ entity, temporary }) => {
  const [radarTiles, setRadarTiles] = useState([]);
  const [buildingModels, bulldozerMode, setSelectedItem, selectedItem] = useStore((state) => [
    state.buildingModels,
    state.bulldozerMode,
    state.setSelectedItem,
    state.selectedItem,
  ]);
  const meshRef = useRef();
  const [hashGrid] = useStore((state) => [state.hashGrid]);
  let meshColor = 'white';
  let position = [entity.position.x, 0, entity.position.z];
  let rotationY = entity.rotationY;
  let scale = [1, 1, 1];
  let fbx = null;
  let greyColor = new THREE.Color(0.507068395614624, 0.47561749815940857, 0.465393602848053);
  let platformPosition = [
    entity.position.x + entity.platformPositionModifier[0],
    0,
    entity.position.z + entity.platformPositionModifier[2],
  ];

  if (entity.buildingLevel > 0) {
    const model = buildingModels.filter(
      (buildingModel) => buildingModel.key === entity.buildingModel,
    )[0];
    fbx = model.fbx.clone(true);

    scale = entity.scale;
    fbx.castShadow = true;
    fbx.traverse((children) => {
      if (typeof children.isMesh !== 'undefined' && children.isMesh === true) {
        children.castShadow = true;
        children.receiveShadow = true;
      }
    });

    position = [
      position[0] + entity.positionModifier[0],
      position[1] + entity.positionModifier[1],
      position[2] + entity.positionModifier[2],
    ];
  } else {
    if (entity.type === 'residential') {
      meshColor = new THREE.Color('#228B22');
    } else if (entity.type === 'industrial') {
      meshColor = new THREE.Color('#FFFF00');
    } else if (entity.type === 'commercial') {
      meshColor = 'blue';
    }
  }

  // console.log('render');

  const onPointerUpFunction = (e) => {
    e.stopPropagation();
    if (e.button === 0) {
      if (bulldozerMode) {
        entity.parent.buildings = entity.parent.buildings.filter(
          (building) => building.id !== entity.id,
        );
        if (entity.type === 'residential') {
          entity.parent.residential = entity.parent.residential.filter(
            (building) => building.id !== entity.id,
          );
        } else if (entity.type === 'commercial') {
          entity.parent.commercial = entity.parent.commercial.filter(
            (building) => building.id !== entity.id,
          );
        } else if (entity.type === 'industrial') {
          entity.parent.industrial = entity.parent.industrial.filter(
            (building) => building.id !== entity.id,
          );
        }
        entity.parent.soundManager.playSound('fx_bulldozer', false);
        entity.parent.removeEntity(entity.id);
        entity.parent.requiresUpdate = true;
      } else {
        // setSelectedItem(entity);
        // if (entity.type === 'power' || entity.type === 'water') {
        //   setRadarTiles(entity.radarTiles);
        // }
        // entity.parent.requiresUpdate = true;
        // entity.parent.soundManager.playSound('fx_uiclick', false);
      }
    }
  };

  return (
    <>
      {entity.buildingLevel > 0 ? (
        <>
          <group
            onPointerUp={(e) => {
              onPointerUpFunction(e);
            }}
          >
            <mesh position={[platformPosition[0], 0.01, platformPosition[2]]} receiveShadow>
              <boxGeometry args={[entity.platformSize, 0.1, entity.platformSize]} />
              <meshStandardMaterial color={greyColor} />
            </mesh>
            <mesh
              ref={meshRef}
              scale={scale}
              position={[position[0], 0, position[2]]}
              rotation-y={rotationY}
            >
              <primitive object={fbx} dispose={null} />
            </mesh>
            {typeof selectedItem !== 'undefined' &&
            selectedItem !== null &&
            selectedItem.id === entity.id ? (
              <>
                {radarTiles.length > 0 ? (
                  <>
                    {radarTiles.map((tile, index) => {
                      return (
                        <mesh position={[tile.x, 0.01, tile.z]} key={index}>
                          <boxGeometry args={[1, 0.02, 1]} />
                          <meshStandardMaterial color="blue" opacity={0.6} transparent />
                        </mesh>
                      );
                    })}
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </group>
        </>
      ) : (
        <>
          <mesh
            position={[platformPosition[0], 0.01, platformPosition[2]]}
            receiveShadow
            onPointerUp={(e) => {
              onPointerUpFunction(e);
            }}
          >
            <boxGeometry args={[entity.platformSize, 0.1, entity.platformSize]} />
            <meshStandardMaterial color={greyColor} />
          </mesh>
          <mesh ref={meshRef} position={[position[0], 0.11, position[2]]}>
            <boxGeometry args={[entity.platformSize, 0.1, entity.platformSize]} />
            <meshStandardMaterial color={meshColor} opacity={0.6} transparent />
          </mesh>
        </>
      )}
    </>
  );
};

export default Building;
