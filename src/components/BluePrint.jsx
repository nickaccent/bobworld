import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import * as THREE from 'three';

const BluePrint = () => {
  const meshRef = useRef();
  const [buildingModels, blueprintPosition, blueprintModel, w, d, entityManager] = useStore(
    (state) => [
      state.buildingModels,
      state.blueprintPosition,
      state.blueprintModel,
      state.w,
      state.d,
      state.entityManager,
    ],
  );

  const [radarTiles, setRadarTiles] = useState([]);

  const [fbx, setFbx] = useState(null);
  const [bigModel, setBigModel] = useState(false);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  let scale = [0.005, 0.005, 0.005];
  let rotationY = 0;

  const findRoad = (gridPos) => {
    // check up
    if (gridPos[1] + 1 >= 0) {
      const up = checkForRoad([gridPos[0], gridPos[1] + 1]);
      if (typeof up !== 'undefined' && up !== null) {
        return up;
      }
    }
    if (gridPos[1] + 1 <= d) {
      const down = checkForRoad([gridPos[0], gridPos[1] - 1]);
      if (typeof down !== 'undefined' && down !== null) {
        return down;
      }
    }
    if (gridPos[0] - 1 >= 0) {
      const left = checkForRoad([gridPos[0] - 1, gridPos[1]]);
      if (typeof left !== 'undefined' && left !== null) {
        return left;
      }
    }
    if (gridPos[1] + 1 <= d) {
      const right = checkForRoad([gridPos[0] + 1, gridPos[1]]);
      if (typeof right !== 'undefined' && right !== null) {
        return right;
      }
    }
    return null;
  };

  const checkForRoad = (gridPos) => {
    const gKey = entityManager.hashGrid.Key(gridPos[0], gridPos[1]);
    const roadPointGridCell = entityManager.hashGrid.GetCellByKey(gKey);
    return roadPointGridCell.set.filter((client) => client.type === 'road')[0];
  };

  const getRadarTiles = (gridPos) => {
    let leftMargin = 0;
    if (gridPos[0] - 4 >= 0) {
      leftMargin = -4;
    } else if (gridPos[0] - 3 >= 0) {
      leftMargin = -3;
    } else if (gridPos[0] - 2 >= 0) {
      leftMargin = -2;
    } else if (gridPos[0] - 1 >= 0) {
      leftMargin = -1;
    }

    let rightMargin = 0;
    if (gridPos[0] + 4 <= w) {
      rightMargin = 4;
    } else if (gridPos[0] + 3 <= w) {
      rightMargin = 3;
    } else if (gridPos[0] + 2 <= w) {
      rightMargin = 2;
    } else if (gridPos[0] + 1 <= w) {
      rightMargin = 1;
    }

    let topMargin = 0;
    if (gridPos[1] - 4 >= 0) {
      topMargin = -4;
    } else if (gridPos[1] - 3 >= 0) {
      topMargin = -3;
    } else if (gridPos[1] - 2 >= 0) {
      topMargin = -2;
    } else if (gridPos[1] - 1 >= 0) {
      topMargin = -1;
    }

    let bottomMargin = 0;
    if (gridPos[1] + 4 <= d) {
      bottomMargin = 4;
    } else if (gridPos[1] + 3 <= d) {
      bottomMargin = 3;
    } else if (gridPos[1] + 2 <= d) {
      bottomMargin = 2;
    } else if (gridPos[1] + 1 <= d) {
      bottomMargin = 1;
    }
    let available_tiles = [
      '-4.0',
      '-3.-1',
      '-3.0',
      '-3.1',
      '-2.-2',
      '-2.-1',
      '-2.0',
      '-2.1',
      '-2.2',
      '-1.-3',
      '-1.-2',
      '-1.-1',
      '-1.0',
      '-1.1',
      '-1.2',
      '-1.3',
      '0.-4',
      '0.-3',
      '0.-2',
      '0.-1',
      '0.0',
      '0.1',
      '0.2',
      '0.3',
      '0.4',
      '1.-3',
      '1.-2',
      '1.-1',
      '1.0',
      '1.1',
      '1.2',
      '1.3',
      '2.-2',
      '2.-1',
      '2.0',
      '2.1',
      '2.2',
      '3.-1',
      '3.0',
      '3.1',
      '4.0',
    ];
    let gridCellArray = [];
    for (let x = leftMargin; x <= rightMargin; x++) {
      for (let y = topMargin; y <= bottomMargin; y++) {
        let tempK = `${x}.${y}`;
        if (available_tiles.includes(tempK)) {
          let actualK = `${gridPos[0] + x}.${gridPos[1] + y}`;
          let xVal = gridPos[0] + x;
          xVal = xVal - Math.floor(w / 2);
          let zVal = gridPos[1] + y;
          zVal = zVal - Math.floor(d / 2);
          gridCellArray.push({ key: actualK, x: xVal, z: zVal });
        }
      }
    }
    return gridCellArray;
  };

  useEffect(() => {
    if (blueprintModel !== null) {
      if (
        blueprintModel === 'water_plant_blueprint' ||
        blueprintModel === 'power_station_blueprint'
      ) {
        setBigModel(true);
      }
      const model = buildingModels.filter(
        (buildingModel) => buildingModel.key === blueprintModel,
      )[0];
      setFbx(model.fbx.clone(true));
    }
  }, []);

  useEffect(() => {
    if (fbx !== null) {
      fbx.castShadow = true;
      fbx.traverse((children) => {
        if (typeof children.isMesh !== 'undefined' && children.isMesh === true) {
          children.castShadow = true;
          children.receiveShadow = true;
        }
      });
      fbx.children[0].material.transparent = true;
      fbx.children[0].material.opacity = 0.5;
    }
  }, [fbx]);

  useEffect(() => {
    if (bigModel === true) {
      blueprintPosition.x = blueprintPosition.x + 0.45;
      blueprintPosition.z = blueprintPosition.z + 0.55;
      let wHalf = Math.floor(w / 2);
      let dHalf = Math.floor(d / 2);
      let gridPos = [
        Math.floor(blueprintPosition.x) + wHalf,
        Math.floor(blueprintPosition.z) + dHalf,
      ];
      let road = findRoad(gridPos);
      if (road.position[0] > gridPos[0]) {
        // road is to the right
        blueprintPosition.x = blueprintPosition.x - 1;
      } else if (road.position[0] < gridPos[0]) {
        // road is to the left
      } else if (road.position[1] > gridPos[1]) {
        // road below
        // minus to z position
        blueprintPosition.z = blueprintPosition.z - 1;
      } else if (road.position[1] < gridPos[1]) {
        // road above
        // do nothing position
      }
      let radarTilesTemp = getRadarTiles(gridPos);
      setRadarTiles(radarTilesTemp);
    }
    setPosition(blueprintPosition);
  }, [blueprintPosition]);

  //
  return (
    <>
      {fbx !== null ? (
        <>
          <mesh
            ref={meshRef}
            scale={scale}
            position={[position.x, 0, position.z]}
            rotation-y={rotationY}
          >
            <primitive object={fbx} dispose={null} />
          </mesh>
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
    </>
  );
};

export default BluePrint;
