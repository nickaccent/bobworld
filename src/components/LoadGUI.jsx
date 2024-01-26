import React, { useState, useEffect } from 'react';
import Road from '../classes/Road';
import Person from '../classes/Person';
import Residential from '../classes/Residential';
import Commercial from '../classes/Commercial';
import Industrial from '../classes/Industrial';
import { useStore } from '../hooks/useStore';

const LoadGUI = () => {
  const [setStart, storeEntityManager, pathFindingGrid] = useStore((state) => [
    state.setStart,
    state.entityManager,
    state.pathFindingGrid,
  ]);
  const [setLoad, load] = useStore((state) => [state.setLoad, state.load]);
  const [saveFiles, setSaveFiles] = useState([]);
  useEffect(() => {
    if (load === true) {
      let saveFilesTemp = localStorage.getItem('saveData');
      setSaveFiles(JSON.parse(saveFilesTemp));
    }
  }, [load]);

  const loadGame = (file) => {
    // storeEntityManager.saveData.entities = JSON.parse(file.saveData).entities;
    let tempEntities = JSON.parse(file.saveData).entities;
    storeEntityManager.gameFunds = JSON.parse(file.saveData).gameFunds;
    storeEntityManager.clockH = JSON.parse(file.saveData).clockH;
    storeEntityManager.clockM = JSON.parse(file.saveData).clockM;
    storeEntityManager.days = JSON.parse(file.saveData).days;
    storeEntityManager.elapsedTime = JSON.parse(file.saveData).elapsedTime;
    storeEntityManager.elapsedTimeLoad = true;

    // storeEntityManager.hashGrid = JSON.parse(file.saveData).hashGrid;
    storeEntityManager.maxPeople = JSON.parse(file.saveData).maxPeople;
    storeEntityManager.taxRate = JSON.parse(file.saveData).taxRate;
    let roads = tempEntities.filter((entity) => entity.type === 'road');
    let residential = tempEntities.filter((entity) => entity.type === 'residential');
    let people = tempEntities.filter((entity) => entity.type === 'person');
    let commercial = tempEntities.filter((entity) => entity.type === 'commercial');
    let industrial = tempEntities.filter((entity) => entity.type === 'industrial');
    storeEntityManager.entities = [];
    storeEntityManager.roads = [];
    storeEntityManager.buildings = [];
    storeEntityManager.residential = [];
    storeEntityManager.industrial = [];
    storeEntityManager.commercial = [];

    roads.forEach((entity) => {
      if (entity.type === 'road') {
        let roadEntity = new Road({
          grid: storeEntityManager.hashGrid,
          x: entity.position.x,
          y: entity.position.y,
          z: entity.position.z,
          type: 'road',
          w: storeEntityManager.w,
          d: storeEntityManager.d,
          parent: storeEntityManager,
        });
        roadEntity.AddToParentArray();
        roadEntity.id = entity.id;
        storeEntityManager.addEntity(roadEntity);
      }
    });

    people.forEach((entity) => {
      const personEntity = new Person({
        grid: storeEntityManager.hashGrid,
        x: Math.floor(entity.position.x),
        y: entity.position.y,
        z: Math.floor(entity.position.z),
        type: 'person',
        w: storeEntityManager.w,
        d: storeEntityManager.d,
        parent: storeEntityManager,
        funds: entity.funds,
        spawnBuilding: entity.building,
      });
      personEntity.sleepStartH = entity.sleepStartH;
      personEntity.sleepStartM = entity.sleepStartM;
      personEntity.sleepEndH = entity.sleepEndH;
      personEntity.sleepEndM = entity.sleepEndM;
      personEntity.setOffForWorkM = entity.setOffForWorkM;
      personEntity.id = entity.id;
      storeEntityManager.addEntity(personEntity);
    });

    residential.forEach((entity) => {
      const residentialEntity = new Residential({
        grid: storeEntityManager.hashGrid,
        x: Math.floor(entity.position.x),
        y: entity.position.y,
        z: Math.floor(entity.position.z),
        type: 'residential',
        w: storeEntityManager.w,
        d: storeEntityManager.d,
        parent: storeEntityManager,
        buildingLevel: entity.buildingLevel,
      });
      residentialEntity.buildingModel = entity.buildingModel;
      residentialEntity.id = entity.id;
      residentialEntity.SetLevel(entity.buildingLevel);
      residentialEntity.tenants = [];
      people.forEach((person) => {
        if (person.homeBuilding === residentialEntity.id) {
          residentialEntity.tenants.push(person.id);
        }
      });
      pathFindingGrid.setWalkableAt(
        Math.floor(residentialEntity.gridPos[0]),
        Math.floor(residentialEntity.gridPos[1]),
        false,
      );
      storeEntityManager.addEntity(residentialEntity);
    });

    industrial.forEach((entity) => {
      const industrialEntity = new Industrial({
        grid: storeEntityManager.hashGrid,
        x: Math.floor(entity.position.x),
        y: entity.position.y,
        z: Math.floor(entity.position.z),
        type: 'industrial',
        w: storeEntityManager.w,
        d: storeEntityManager.d,
        parent: storeEntityManager,
        buildingLevel: entity.buildingLevel,
      });
      industrialEntity.id = entity.id;

      people.forEach((person) => {
        if (person.job === industrialEntity.id) {
          industrialEntity.employees.push(person.id);
        }
      });

      industrialEntity.goods = entity.goods;
      industrialEntity.deliveryBatches = entity.deliveryBatches;
      industrialEntity.current_funds = entity.current_funds;
      industrialEntity.buildingModel = entity.buildingModel;

      pathFindingGrid.setWalkableAt(
        Math.floor(industrialEntity.gridPos[0]),
        Math.floor(industrialEntity.gridPos[1]),
        false,
      );
      storeEntityManager.addEntity(industrialEntity);
    });

    commercial.forEach((entity) => {
      const commercialEntity = new Commercial({
        grid: storeEntityManager.hashGrid,
        x: Math.floor(entity.position.x),
        y: entity.position.y,
        z: Math.floor(entity.position.z),
        type: 'commercial',
        w: storeEntityManager.w,
        d: storeEntityManager.d,
        parent: storeEntityManager,
        buildingLevel: entity.buildingLevel,
      });
      commercialEntity.id = entity.id;

      people.forEach((person) => {
        if (person.job === commercialEntity.id) {
          commercialEntity.employees.push(person.id);
        }
      });

      commercialEntity.stock = entity.stock;
      commercialEntity.current_funds = entity.current_funds;
      commercialEntity.buildingModel = entity.buildingModel;

      pathFindingGrid.setWalkableAt(
        Math.floor(commercialEntity.gridPos[0]),
        Math.floor(commercialEntity.gridPos[1]),
        false,
      );
      storeEntityManager.addEntity(commercialEntity);
    });

    for (let i = 0; i < storeEntityManager.entities.length; i++) {
      storeEntityManager.entities[i].GetConnected();
      if (storeEntityManager.entities[i].type === 'road') {
        storeEntityManager.entities[i].RoadFix();
        storeEntityManager.roads.push(storeEntityManager.entities[i]);
      }
    }
    for (let y = 0; y < storeEntityManager.d; y++) {
      for (let x = 0; x < storeEntityManager.w; x++) {
        storeEntityManager.roadsGrid.setWalkableAt(x, y, false);
      }
    }
    storeEntityManager.entities.forEach((entity) => {
      if (entity.type === 'road') {
        storeEntityManager.roadsGrid.setWalkableAt(
          Math.floor(entity.gridPos[0]),
          Math.floor(entity.gridPos[1]),
          true,
        );
      }
    });

    setLoad(false);
    setStart(true);
  };
  return (
    <div className="center">
      <div className="glassmorphism p-2 b-r-8 c-intro text-center">
        <h2 className="mt-h">Three World</h2>
        <p>Save Games.</p>
        <table>
          <tbody>
            {saveFiles?.files?.map((file, index) => {
              return (
                <tr key={index}>
                  <td>Game: {file.created_date}</td>
                  <td>
                    <button className="button mt-1" onClick={() => loadGame(file)}>
                      Load Game
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadGUI;
