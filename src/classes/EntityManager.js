import AdjacencyGraph from './AdjacencyGraph.js';
import Person from './Person.js';
import Vehicle from './Vehicle.js';

class EntityManager {
  constructor(hashGrid, w, d, soundManager) {
    this.gameFunds = 100.0;
    this.taxRate = 20;
    this.entities = [];
    this.temporaryEntities = [];
    this.buildings = [];
    this.residential = [];
    this.commercial = [];
    this.industrial = [];
    this.utilities = [];
    this.people = [];
    this.vehicles = [];
    this.roads = [];
    this.roadsGrid = null;
    this.hashGrid = hashGrid;
    this.requiresUpdate = false;
    this.maxPeople = 10;
    this.w = w;
    this.d = d;
    this.width = w;
    this.depth = d;
    this.pathsDirty = false;
    this.pedestrianAdjacencyGraph = new AdjacencyGraph();
    this.clockH = 0;
    this.clockM = 0;
    this.days = 0;
    this.soundManager = soundManager;
    this.elapsedTime = 0.0;
    this.elapsedTimeLoad = false;
    this.initialized = false;
    this.clockUpdate = false;
  }

  addEntity(entity) {
    this.entities.push(entity);
    this.requiresUpdate = true;
  }

  addTemporaryEntity(entity) {
    this.temporaryEntities.push(entity);
    this.requiresUpdate = true;
  }

  removeEntity(id) {
    let entity = this.getEntity(id);
    if (typeof entity !== 'undefined') {
      let key = this.hashGrid.Key(entity.gridPos[0], entity.gridPos[1]);
      let cell = this.hashGrid.GetCellByKey(key);
      cell.type = 'EMPTY';
      if (entity.hasOwnProperty('grid')) {
        entity.grid.RemoveClient(entity.client);
      }
    }
    this.entities = this.entities.filter((entity) => entity.id !== id);
  }

  removeTemporaryEntity(id) {
    let entity = this.getTemporaryEntity(id);
    entity.grid.RemoveClient(entity.client);
    this.temporaryEntities = this.temporaryEntities.filter((entity) => entity.id !== id);
  }

  ClearTemporaryEntities() {
    for (let i = 0; i < this.temporaryEntities.length; i++) {
      var gridKey = this.temporaryEntities[i].grid.Key(
        this.temporaryEntities[i].gridPos[0],
        this.temporaryEntities[i].gridPos[1],
      );
      var gridCell = this.hashGrid.GetCellByKey(gridKey);
      if (this.temporaryEntities[i].type === 'road' && gridCell.type === 'ROAD') {
        gridCell.type = 'EMPTY';
      } else if (this.temporaryEntities[i].type === 'house' && gridCell.type === 'HOUSE') {
        gridCell.type = 'EMPTY';
      } else if (this.temporaryEntities[i].type === 'shop' && gridCell.type === 'SHOP') {
        gridCell.type = 'EMPTY';
      }
      this.temporaryEntities[i].grid.RemoveClient(this.temporaryEntities[i].client);
    }
    this.temporaryEntities = [];
  }

  moveTemporaryEntitiesToEntities() {
    for (let i = 0; i < this.temporaryEntities.length; i++) {
      this.temporaryEntities[i].AddToParentArray();
      var gridKey = this.temporaryEntities[i].grid.Key(
        this.temporaryEntities[i].gridPos[0],
        this.temporaryEntities[i].gridPos[1],
      );
      var gridCell = this.hashGrid.GetCellByKey(gridKey);
      if (this.temporaryEntities[i].type === 'road' && gridCell.type === 'EMPTY') {
        gridCell.type = 'ROAD';
        this.hashGrid.NewClient(
          this.temporaryEntities[i].gridPos,
          [1, 1],
          this.temporaryEntities[i].IsWalkable(),
          this.temporaryEntities[i].id,
          this.temporaryEntities[i].type,
        );
      }

      this.entities.push(this.temporaryEntities[i]);
    }
    this.temporaryEntities = [];
  }

  getTemporaryEntity(id) {
    return this.temporaryEntities.find((entity) => entity.id === id);
  }

  getEntity(id) {
    return this.entities.find((entity) => entity.id === id);
  }

  getEntityByGridPos(gridPos) {
    let key = this.hashGrid.Key(gridPos[0], gridPos[1]);
    let cell = this.hashGrid.GetCellByKey(key);
    console.log(this.cell);
    return this.entities.find((entity) => entity.gridPos === gridPos);
  }

  SpawnPersonInBuilding(building, funds) {
    const person = new Person({
      grid: this.hashGrid,
      x: 0.0,
      y: 0.5,
      z: 0.0,
      type: 'person',
      w: this.w,
      d: this.d,
      parent: this,
      funds: funds,
      spawnBuilding: building,
    });
    this.addEntity(person);
    return person;
  }

  SpawnCar() {
    let building = this.buildings[this.RandomIntFromInterval(0, this.buildings.length - 1)];
    const vehicle = new Vehicle({
      grid: this.hashGrid,
      x: 0.0,
      y: 0.5,
      z: 0.0,
      type: 'vehicle',
      w: this.w,
      d: this.d,
      parent: this,
      spawnBuilding: building,
    });
    this.addEntity(vehicle);
    return vehicle;
  }

  FindOpenJobs() {
    let industrial_jobs = this.industrial.filter(
      (building) => building.employees.length < building.maxEmployees && building.buildingLevel > 0,
    );
    let commercial_jobs = this.commercial.filter(
      (building) => building.employees.length < building.maxEmployees && building.buildingLevel > 0,
    );
    return {
      total: industrial_jobs.length + commercial_jobs.length,
      industrial_jobs: industrial_jobs,
      commercial_jobs: commercial_jobs,
    };
  }

  PayDailyTax() {
    let total = 0;
    this.roads.forEach((road) => {
      total += road.taxCost;
    });
    this.utilities.forEach((utility) => {
      total += utility.levelData.cost;
    });
    this.gameFunds -= total;
  }

  RandomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  AnimateAgentUpdate(delta) {
    this.people.forEach((person) => {
      person.AnimateUpdate(delta, this.clockH, this.clockM);
    });
  }

  Update(delta) {
    this.industrial.forEach((building) => {
      building.Update(delta, this.clockH, this.clockM);
    });
    this.commercial.forEach((building) => {
      building.Update(delta, this.clockH, this.clockM);
    });
    this.residential.forEach((building) => {
      building.Update(delta, this.clockH, this.clockM);
    });
    this.people.forEach((person) => {
      person.Update(delta, this.clockH, this.clockM);
    });
    // this.vehicles.forEach((vehicle) => {
    //   vehicle.Update(delta, this.clockH, this.clockM);
    // });

    // if (this.pathsDirty === true) {
    //   this.people.forEach((person) => {
    //     person.RecalculatePathBetween();
    //   });
    //   this.requiresUpdate = true;
    //   this.pathsDirty = false;
    // }
  }

  SaveGame() {
    this.saveData = {
      gameFunds: this.gameFunds,
      taxRate: this.taxRate,
      entities: [],
      hashGrid: this.hashGrid,
      maxPeople: this.maxPeople,
      w: this.w,
      d: this.d,
      clockH: this.clockH,
      clockM: this.clockM,
      days: this.days,
      elapsedTime: this.elapsedTime,
    };
    this.entities.forEach((entity) => {
      let saveEntity = { ...entity };
      this.saveData.entities.push(saveEntity);
    });

    this.saveData.entities.forEach((entity) => {
      delete entity.parent;
      if (entity.type === 'road') {
        delete entity.pedestrianMarkers;
        delete entity.carMarkers;
      }
    });
    let json = JSON.stringify(this.saveData);
    let saveFilesData = localStorage.getItem('saveData');
    let saveFiles = { files: [] };
    if (saveFilesData !== null) {
      saveFiles = JSON.parse(saveFilesData);
    }
    saveFiles.files.push({ saveData: json, created_date: new Date().toLocaleString() });
    localStorage.setItem('saveData', JSON.stringify(saveFiles));
  }
}

export default EntityManager;
