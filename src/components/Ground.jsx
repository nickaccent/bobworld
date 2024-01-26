import React, { useRef, useEffect, useContext } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Road from '../classes/Road';
import Residential from '../classes/Residential';
import Commercial from '../classes/Commercial';
import Industrial from '../classes/Industrial';
import Utility from '../classes/Utility';
import { RepeatWrapping } from 'three';
import * as THREE from 'three';
import * as PF from 'pathfinding';

import { EntityManagerContext } from '../contexts/EntityManager';
import { ClockContext } from '../contexts/Clock';
import { GUIContext } from '../contexts/GUI';
import { PathFindingGridContext } from '../contexts/PathFindingGrid';

const Ground = () => {
  const { clockH, clockM, delta } = useContext(ClockContext);
  const { entityManager } = useContext(EntityManagerContext);
  const {
    buildType,
    setBuildType,
    setShowBuildingMenu,
    setBulldozerMode,
    setSelectedItem,
    canBuildBuilding,
    setCanBuildBuilding,
    setNewRoadsCount,
    newRoadsCount,
    funds,
    setFunds,
    placementMode,
    setPlacementMode,
  } = useContext(GUIContext);
  const { pathFindingGrid, startPosition, setStartPosition } = useContext(PathFindingGridContext);

  let wHalf = Math.floor(entityManager.width / 2);
  let dHalf = Math.floor(entityManager.depth / 2);

  const groundRef = useRef();
  const groundMat = useTexture('/Materials/grassCenter.png');

  const rolloverMesh = useRef();

  groundMat.wrapS = RepeatWrapping;
  groundMat.wrapT = RepeatWrapping;

  useEffect(() => {
    if (clockH === 0 && clockM === 0) {
      entityManager.PayDailyTax();
    }
    if (funds != entityManager.gameFunds) {
      setFunds(entityManager.gameFunds);
    }
    entityManager.Update(delta);
  }, [clockM]);

  useFrame((state, delta) => {
    entityManager.AnimateAgentUpdate(delta);
  });

  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        receiveShadow
        ref={groundRef}
        name="ground"
        visible={true}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (e.button === 0) {
            if (buildType !== null) {
              let [x, y, z] = Object.values(e.point);
              if (Math.floor(x) < Math.round(x)) {
                x = Math.round(x);
              }
              if (Math.floor(z) < Math.round(z)) {
                z = Math.round(z);
              }
              if (
                entityManager.hashGrid.CheckPositionIsFree(
                  Math.floor(x) + wHalf,
                  Math.floor(z) + dHalf,
                )
              ) {
                if (placementMode === false) {
                  if (buildType === 'road') {
                    const road = new Road({
                      grid: entityManager.hashGrid,
                      x: Math.floor(x),
                      y: 0.5,
                      z: Math.floor(z),
                      type: buildType,
                      w: entityManager.width,
                      d: entityManager.depth,
                      parent: entityManager,
                    });
                    road.AddToParentArray();
                    entityManager.addTemporaryEntity(road);
                    setStartPosition(new THREE.Vector3(Math.round(x), 0.5, Math.round(z)));
                    setPlacementMode(true);
                    entityManager.soundManager.playSound('fx_placement', false);
                  } else if (buildType === 'residential') {
                    if (canBuildBuilding === true) {
                      const entity = new Residential({
                        grid: entityManager.hashGrid,
                        x: Math.floor(x),
                        y: 0.5,
                        z: Math.floor(z),
                        type: buildType,
                        w: entityManager.width,
                        d: entityManager.depth,
                        parent: entityManager,
                        buildingLevel: 0,
                      });
                      pathFindingGrid.setWalkableAt(
                        Math.floor(entity.gridPos[0]),
                        Math.floor(entity.gridPos[1]),
                        false,
                      );
                      entityManager.addEntity(entity);
                      entityManager.soundManager.playSound('fx_placement', false);
                    } else {
                      entityManager.soundManager.playSound('fx_error', false);
                    }
                  } else if (buildType === 'commercial') {
                    if (canBuildBuilding === true) {
                      const entity = new Commercial({
                        grid: entityManager.hashGrid,
                        x: Math.floor(x),
                        y: 0.5,
                        z: Math.floor(z),
                        type: buildType,
                        w: entityManager.width,
                        d: entityManager.depth,
                        parent: entityManager,
                        buildingLevel: 0,
                      });
                      pathFindingGrid.setWalkableAt(
                        Math.floor(entity.gridPos[0]),
                        Math.floor(entity.gridPos[1]),
                        false,
                      );
                      entityManager.addEntity(entity);
                      entityManager.soundManager.playSound('fx_placement', false);
                    } else {
                      entityManager.soundManager.playSound('fx_error', false);
                    }
                  } else if (buildType === 'industrial') {
                    if (canBuildBuilding === true) {
                      const entity = new Industrial({
                        grid: entityManager.hashGrid,
                        x: Math.floor(x),
                        y: 0.5,
                        z: Math.floor(z),
                        type: buildType,
                        w: entityManager.width,
                        d: entityManager.depth,
                        parent: entityManager,
                        buildingLevel: 0,
                      });
                      pathFindingGrid.setWalkableAt(
                        Math.floor(entity.gridPos[0]),
                        Math.floor(entity.gridPos[1]),
                        false,
                      );
                      entityManager.addEntity(entity);
                      entityManager.soundManager.playSound('fx_placement', false);
                    } else {
                      entityManager.soundManager.playSound('fx_error', false);
                    }
                  } else if (buildType === 'power') {
                    if (canBuildBuilding === true) {
                      const entity = new Utility({
                        grid: entityManager.hashGrid,
                        x: Math.floor(x),
                        y: 0.5,
                        z: Math.floor(z),
                        type: buildType,
                        w: entityManager.width,
                        d: entityManager.depth,
                        parent: entityManager,
                        utilityType: 'power_station',
                      });
                      pathFindingGrid.setWalkableAt(
                        Math.floor(entity.gridPos[0]),
                        Math.floor(entity.gridPos[1]),
                        false,
                      );
                      entityManager.addEntity(entity);
                      entityManager.gameFunds -= entity.levelData.upFrontCost;
                      entityManager.soundManager.playSound('fx_placement', false);
                    } else {
                      entityManager.soundManager.playSound('fx_error', false);
                    }
                  } else if (buildType === 'water') {
                    if (canBuildBuilding === true) {
                      const entity = new Utility({
                        grid: entityManager.hashGrid,
                        x: Math.floor(x),
                        y: 0.5,
                        z: Math.floor(z),
                        type: buildType,
                        w: entityManager.width,
                        d: entityManager.depth,
                        parent: entityManager,
                        utilityType: 'water_plant',
                      });
                      pathFindingGrid.setWalkableAt(
                        Math.floor(entity.gridPos[0]),
                        Math.floor(entity.gridPos[1]),
                        false,
                      );
                      entityManager.addEntity(entity);
                      entityManager.gameFunds -= entity.levelData.upFrontCost;
                      entityManager.soundManager.playSound('fx_placement', false);
                    } else {
                      entityManager.soundManager.playSound('fx_error', false);
                    }
                  }
                }
              } else {
                entityManager.soundManager.playSound('fx_error', false);
              }
            } else {
              setSelectedItem(null);
            }
          } else if (e.button === 1) {
            setPlacementMode(false);
            setBuildType(null);
            setShowBuildingMenu(false);
            setBulldozerMode(false);
            // setBlueprintModel(null);
            setSelectedItem(null);
          }
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          for (let i = 0; i < e.intersections.length; i++) {
            if (e.intersections[i].eventObject.name === 'ground') {
              const [x, y, z] = e.intersections[i].point;
              let newpos = new THREE.Vector3();
              newpos.x = Math.round(x);
              newpos.y = 0.01;
              newpos.z = Math.round(z);

              let gridPos = [Math.floor(newpos.x) + wHalf, Math.floor(newpos.z) + dHalf];
              let nearby = entityManager.hashGrid.FindNearRestricted(gridPos);
              let buildable = false;
              let key = entityManager.hashGrid.Key(gridPos[0], gridPos[1]);
              let cell = entityManager.hashGrid.GetCellByKey(key);

              for (let i = 0; i < nearby.length; i++) {
                if (nearby[i].type === 'road') {
                  buildable = true;
                }
              }
              if (typeof cell !== 'undefined') {
                if (cell.type !== 'EMPTY') {
                  buildable = false;
                }
              }
              if (buildable === true) {
                setCanBuildBuilding(true);
              } else {
                setCanBuildBuilding(false);
              }

              if (rolloverMesh.current) {
                if (
                  buildType === 'industrial' ||
                  buildType === 'commercial' ||
                  buildType === 'residential' ||
                  buildType === 'water' ||
                  buildType === 'power'
                ) {
                  if (buildable === true) {
                    // if (buildType === 'residential') {
                    //   setBlueprintModel('house_blueprint');
                    // } else if (buildType === 'commercial') {
                    //   setBlueprintModel('shop_blueprint');
                    // } else if (buildType === 'industrial') {
                    //   setBlueprintModel('factory_blueprint');
                    // } else if (buildType === 'water') {
                    //   setBlueprintModel('water_plant_blueprint');
                    // } else if (buildType === 'power') {
                    //   setBlueprintModel('power_station_blueprint');
                    // }
                    rolloverMesh.current.material.color.setHex(0x0fff50);
                  } else {
                    // setBlueprintModel(null);
                    rolloverMesh.current.material.color.setHex(0xc70039);
                  }
                } else {
                  rolloverMesh.current.material.color.setHex(0x6495ed);
                }
                rolloverMesh.current.position.copy(newpos);
                // let bpPos = new THREE.Vector3();
                // bpPos.copy(newpos);
                // setBlueprintPosition(bpPos);
              }
            }
          }

          if (placementMode === true) {
            if (buildType === 'road') {
              let [x, y, z] = Object.values(e.point);
              if (Math.floor(x) < Math.round(x)) {
                x = Math.round(x);
              }
              if (Math.floor(z) < Math.round(z)) {
                z = Math.round(z);
              }
              let startNode = pathFindingGrid.getNodeAt(
                Math.floor(startPosition.x) + wHalf,
                Math.floor(startPosition.z) + dHalf,
              );
              let endNode = pathFindingGrid.getNodeAt(Math.floor(x) + wHalf, Math.floor(z) + dHalf);
              let gridBackup = pathFindingGrid.clone();
              const finder = new PF.AStarFinder();
              const path = finder.findPath(
                startNode.x,
                startNode.y,
                endNode.x,
                endNode.y,
                gridBackup,
              );
              entityManager.ClearTemporaryEntities();

              setNewRoadsCount(path.length);
              for (let i = 0; i < path.length; i++) {
                if (entityManager.hashGrid.CheckPositionIsFree(path[i][0], path[i][1])) {
                  const road = new Road({
                    grid: entityManager.hashGrid,
                    x: Math.floor(path[i][0] - wHalf),
                    y: 0.5,
                    z: Math.floor(path[i][1] - dHalf),
                    type: buildType,
                    w: entityManager.width,
                    d: entityManager.depth,
                    parent: entityManager,
                  });
                  entityManager.addTemporaryEntity(road);
                }
              }
              for (let i = 0; i < entityManager.temporaryEntities.length; i++) {
                entityManager.temporaryEntities[i].RoadFix();
              }
              for (let i = 0; i < entityManager.entities.length; i++) {
                if (entityManager.entities[i].type === 'road') {
                  entityManager.entities[i].RoadFix();
                }
              }
            }
          }
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          setPlacementMode(false);
          entityManager.moveTemporaryEntitiesToEntities();
          entityManager.ClearTemporaryEntities();
          entityManager.requiresUpdate = true;
          entityManager.roads = [];
          for (let i = 0; i < entityManager.entities.length; i++) {
            entityManager.entities[i].GetConnected();
            if (entityManager.entities[i].type === 'road') {
              entityManager.entities[i].RoadFix();
              entityManager.roads.push(entityManager.entities[i]);
            }
          }
          for (let y = 0; y < entityManager.depth; y++) {
            for (let x = 0; x < entityManager.width; x++) {
              entityManager.roadsGrid.setWalkableAt(x, y, false);
            }
          }
          entityManager.entities.forEach((entity) => {
            if (entity.type === 'road') {
              entityManager.roadsGrid.setWalkableAt(
                Math.floor(entity.gridPos[0]),
                Math.floor(entity.gridPos[1]),
                true,
              );
            }
          });

          entityManager.gameFunds = entityManager.gameFunds - newRoadsCount * 5;
          setNewRoadsCount(0);
        }}
      >
        <planeGeometry args={[entityManager.depth + 0.01, entityManager.width + 0.01]} />
        <meshStandardMaterial color="green" />
      </mesh>
      {buildType !== null && (
        <gridHelper
          args={[entityManager.depth, entityManager.width, 0x015702, 'green']}
          position={[0, 0.001, 0]}
        />
      )}
      <mesh
        position={[0, -0.51, 0]}
        receiveShadow
        visible={true}
        onPointerUp={(e) => {
          e.stopPropagation();
          setSelectedItem(null);
        }}
      >
        <boxGeometry args={[entityManager.depth + 0.01, 1, entityManager.width + 0.01]} />
        <meshStandardMaterial map={groundMat} />
      </mesh>
      <mesh ref={rolloverMesh} position={[0, 0.01, 0]}>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshStandardMaterial color="white" opacity={0.6} transparent />
      </mesh>
    </>
  );
};

export default Ground;
