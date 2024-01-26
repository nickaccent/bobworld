import * as THREE from 'three';
import * as PF from 'pathfinding';
import Entity from './Entity';
import AdjacencyGraph from './AdjacencyGraph.js';
import uuid from 'react-uuid';
import { firstNames, lastNames } from '../utils/names.js';

class Person extends Entity {
  constructor(params) {
    super(params);
    this.id = uuid();
    this.rotation = new THREE.Quaternion();
    this.direction = new THREE.Matrix4();
    this.scale = [0.006, 0.006, 0.006];
    this.spawnBuilding = params.spawnBuilding;
    this.homeBuilding = params.spawnBuilding;
    if (typeof params.funds !== 'undefined') {
      this.funds = params.funds;
    }
    this.parent.people.push(this);
    this.endMovement = false;
    this.agentPath = null;
    this.graph = new AdjacencyGraph();
    this.gridPath = null;
    this.baseSpeed = 0.3;
    this.speed = this.baseSpeed;
    this.visible = false;
    this.moving = false;
    this.job = null;
    this.currentLocation = 'Home';
    this.updateGraph = false;
    this.sleeping = false;
    this.sleepStartH = 23;
    this.sleepStartM = 30;
    this.sleepEndH = 7;
    this.sleepEndM = 30;
    this.setOffForWorkM = 30;
    this.finishWorkM = 30;
    this.hasCar = false;
    this.setOffTimeH = 0;
    this.setOffTimeM = 0;
    this.destinations = [];
    this.destinationGuiData = '';
    this.name = this.GenerateRandomName();
  }

  // Function to generate a random name
  GenerateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return firstName + ' ' + lastName;
  }

  findTile(searchCriteria, maxDistance) {
    const startEntity = this.parent.getEntity(this.homeBuilding);
    let key = this.parent.hashGrid.Key(startEntity.gridPos[0], startEntity.gridPos[1]);
    let startTile = this.parent.hashGrid.GetCellByKey(key);
    const visited = new Set();
    const tilesToSearch = [];

    tilesToSearch.push(startTile);
    while (tilesToSearch.length > 0) {
      const tile = tilesToSearch.shift();
      if (visited.has(tile.key)) {
        continue;
      } else {
        visited.add(tile.key);
      }

      const distance = startTile.DistanceTo(tile);
      if (distance > maxDistance) {
        continue;
      }

      if (searchCriteria(tile)) {
        return tile;
      } else {
        tilesToSearch.push(...this.GetTileNeighbours(tile.x, tile.y));
      }
    }

    return null;
  }

  GetTileNeighbours(x, y) {
    const neighbours = [];
    if (x > 0) {
      let key = this.parent.hashGrid.Key(x - 1, y);
      let cell = this.parent.hashGrid.GetCellByKey(key);
      if (typeof cell !== 'undefined') {
        neighbours.push(cell);
      }
    }
    if (x < this.parent.w) {
      let key = this.parent.hashGrid.Key(x + 1, y);
      let cell = this.parent.hashGrid.GetCellByKey(key);
      if (typeof cell !== 'undefined') {
        neighbours.push(cell);
      }
    }
    if (y > 0) {
      let key = this.parent.hashGrid.Key(x, y - 1);
      let cell = this.parent.hashGrid.GetCellByKey(key);
      if (typeof cell !== 'undefined') {
        neighbours.push(cell);
      }
    }
    if (y < this.parent.d) {
      let key = this.parent.hashGrid.Key(x, y + 1);
      let cell = this.parent.hashGrid.GetCellByKey(key);
      if (typeof cell !== 'undefined') {
        neighbours.push(cell);
      }
    }

    return neighbours;
  }

  GetAJob() {
    const tile = this.findTile((tile) => {
      if (tile.type !== 'EMPTY') {
        for (var i = 0; i < tile.set.length; i++) {
          if (tile.set[i].type === 'industrial' || tile.set[i].type === 'commercial') {
            let building = this.parent.getEntity(tile.set[i].entity_id);
            if (building.JobsAvailable() > 0) {
              return true;
            }
          }
        }
        return false;
      }
      return false;
    }, 6);

    if (tile) {
      for (var i = 0; i < tile.set.length; i++) {
        if (tile.set[i].type === 'industrial' || tile.set[i].type === 'commercial') {
          let building = this.parent.getEntity(tile.set[i].entity_id);
          if (building.JobsAvailable() > 0) {
            building.employees.push(this.id);
            this.job = building.id;
            let differenceH = this.sleepEndH;
            this.sleepEndH = building.levelData.shift_startH - 1;
            differenceH = differenceH - this.sleepEndH;
            this.sleepEndM = building.levelData.shift_startM;
            this.sleepStartH = this.sleepStartH - differenceH;
            let randomM = Math.floor(Math.random() * 30) + 1;
            this.randomTimeMod = randomM;
            this.setOffForWorkM = this.sleepEndM + randomM;
            this.finishWorkM = building.levelData.shift_endM + randomM;
          }
        }
      }
    } else {
      return null;
    }
  }

  CreateAGraph() {
    for (let i = 0; i < this.gridPath.length; i++) {
      let tempDictionary = new Map();
      const currentPosition = this.gridPath[i];
      const roadStructure = this.GetRoadAtGridPosition(currentPosition);
      const markersList = roadStructure.pedestrianMarkers;
      let limitDistance = false;
      if (markersList.length == 4) {
        limitDistance = true;
      }
      markersList.forEach((marker) => {
        this.graph.AddVertexByPosition(marker.position);
        const neighbours = marker.GetAdjacentPositions();
        neighbours.forEach((neighbour) => {
          this.graph.AddEdge(marker.position, neighbour);
        });
        let nextStep = i + 1;
        if (marker.open && nextStep < this.gridPath.length) {
          let nextRoad = this.GetRoadAtGridPosition(this.gridPath[nextStep]);
          if (limitDistance === true) {
            let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
            tempDictionary.set(marker, {
              marker: marker,
              nextMarker: nextMarker,
            });
          } else {
            let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
            this.graph.AddEdge(marker.position, nextMarker.position);
          }
        }
      });

      if (limitDistance && tempDictionary.size == 4) {
        let distanceSortedMarkers = new Map(
          [...tempDictionary].sort(
            (marker, nextMarker) =>
              marker[1].marker.position.distanceTo(marker[1].nextMarker.position) -
              nextMarker[1].marker.position.distanceTo(nextMarker[1].nextMarker.position),
          ),
        );
        let j = 0;
        distanceSortedMarkers.forEach((marker) => {
          if (j < 2) {
            this.graph.AddEdge(marker.marker.position, marker.nextMarker.position);
          }
          j++;
        });
      }
    }
  }

  ReCreateAGraph() {
    this.graph = new AdjacencyGraph();
    let i = -1;
    let road = this.GetRoadAtPosition(this.position);
    const markersList = road.pedestrianMarkers;
    let limitDistance = false;
    if (markersList.length == 4) {
      limitDistance = true;
    }
    markersList.forEach((marker) => {
      this.graph.AddVertexByPosition(marker.position);
      const neighbours = marker.GetAdjacentPositions();
      neighbours.forEach((neighbour) => {
        this.graph.AddEdge(marker.position, neighbour);
      });
      let nextStep = i + 1;
      if (marker.open && nextStep < this.gridPath.length) {
        let nextRoad = this.GetRoadAtGridPosition(this.gridPath[nextStep]);
        if (limitDistance === true) {
          let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
          tempDictionary.set(marker, {
            marker: marker,
            nextMarker: nextMarker,
          });
        } else {
          let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
          this.graph.AddEdge(marker.position, nextMarker.position);
        }
      }
    });

    if (limitDistance && tempDictionary.size == 4) {
      let distanceSortedMarkers = new Map(
        [...tempDictionary].sort(
          (marker, nextMarker) =>
            marker[1].marker.position.distanceTo(marker[1].nextMarker.position) -
            nextMarker[1].marker.position.distanceTo(nextMarker[1].nextMarker.position),
        ),
      );
      let j = 0;
      distanceSortedMarkers.forEach((marker) => {
        if (j < 2) {
          this.graph.AddEdge(marker.marker.position, marker.nextMarker.position);
        }
        j++;
      });
    }

    for (let i = 0; i < this.gridPath.length; i++) {
      let tempDictionary = new Map();
      const currentPosition = this.gridPath[i];
      const roadStructure = this.GetRoadAtGridPosition(currentPosition);
      const markersList = roadStructure.pedestrianMarkers;
      let limitDistance = false;
      if (markersList.length == 4) {
        limitDistance = true;
      }
      markersList.forEach((marker) => {
        this.graph.AddVertexByPosition(marker.position);
        const neighbours = marker.GetAdjacentPositions();
        neighbours.forEach((neighbour) => {
          this.graph.AddEdge(marker.position, neighbour);
        });
        let nextStep = i + 1;
        if (marker.open && nextStep < this.gridPath.length) {
          let nextRoad = this.GetRoadAtGridPosition(this.gridPath[nextStep]);
          if (limitDistance === true) {
            let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
            tempDictionary.set(marker, {
              marker: marker,
              nextMarker: nextMarker,
            });
          } else {
            let nextMarker = nextRoad.GetClosestMarkerTo(marker.position);
            this.graph.AddEdge(marker.position, nextMarker.position);
          }
        }
      });

      if (limitDistance && tempDictionary.size == 4) {
        let distanceSortedMarkers = new Map(
          [...tempDictionary].sort(
            (marker, nextMarker) =>
              marker[1].marker.position.distanceTo(marker[1].nextMarker.position) -
              nextMarker[1].marker.position.distanceTo(nextMarker[1].nextMarker.position),
          ),
        );
        let j = 0;
        distanceSortedMarkers.forEach((marker) => {
          if (j < 2) {
            this.graph.AddEdge(marker.marker.position, marker.nextMarker.position);
          }
          j++;
        });
      }
    }
  }

  GetRoadAtGridPosition(gridPosition) {
    const cellKey = this.grid.Key(gridPosition[0], gridPosition[1]);
    const cell = this.grid.GetCellByKey(cellKey);
    let cellRoad = null;
    cell.set.forEach((entity) => {
      if (entity.type === 'road') {
        cellRoad = entity;
      }
    });
    const roadStructure = this.parent.getEntity(cellRoad.entity_id);
    return roadStructure;
  }

  CreatePathBetween() {
    const roadsGrid = this.parent.roadsGrid;
    let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
    let startNode = roadsGrid.getNodeAt(spawnPointRoadObj.gridPos[0], spawnPointRoadObj.gridPos[1]);
    let endNode = roadsGrid.getNodeAt(this.endPointRoad.gridPos[0], this.endPointRoad.gridPos[1]);
    let gridBackup = roadsGrid.clone();
    const finder = new PF.AStarFinder();
    this.gridPath = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, gridBackup);
    if (this.gridPath.length > 0) {
      this.agentPath = this.GetPedestrianPath();
    } else {
      this.endMovement = true;
      this.parent.removeEntity(this.id);
      this.parent.people = this.parent.people.filter((person) => person.id !== this.id);
      this.remove = true;
      this.parent.requiresUpdate = true;
    }
  }

  GetRoadAtPosition(position) {
    let posRounded = new THREE.Vector3(
      Math.round(position.x),
      Math.round(position.y),
      Math.round(position.z),
    );
    return this.parent.roads.filter(
      (road) =>
        road.position.x === posRounded.x &&
        road.position.y === 0.5 &&
        road.position.z === posRounded.z,
    )[0];
  }

  RecalculatePathBetween() {
    let road = this.GetRoadAtPosition(this.position);

    const distances = [];
    road.pedestrianMarkers.forEach((marker) => {
      const markerVector = new THREE.Vector3(
        marker.position[0],
        marker.position[1],
        marker.position[2],
      );
      distances.push(this.position.manhattanDistanceTo(markerVector));
    });
    let minimum = Math.min(...distances);
    const markerIndex = distances.indexOf(minimum);
    this.spawnMarker = road.pedestrianMarkers[markerIndex];
    const roadsGrid = this.parent.roadsGrid;
    let startNode = roadsGrid.getNodeAt(road.gridPos[0], road.gridPos[1]);
    let endNode = roadsGrid.getNodeAt(this.endPointRoad.gridPos[0], this.endPointRoad.gridPos[1]);
    let gridBackup = roadsGrid.clone();
    const finder = new PF.AStarFinder();
    this.gridPath = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, gridBackup);
    if (this.gridPath.length > 0) {
      this.agentPath = this.RecreatePedestrianPath();
      this.updateGraph = true;
    } else {
      this.endMovement = true;
      this.parent.removeEntity(this.id);
      this.parent.people = this.parent.people.filter((person) => person.id !== this.id);
      this.remove = true;
      this.parent.requiresUpdate = true;
    }
  }

  GetPedestrianPath() {
    this.graph.ClearGraph();
    this.CreateAGraph();
    let path = this.graph.AStarSearch(this.graph, this.position, this.endPosition);
    path.reverse();
    return path;
  }

  RecreatePedestrianPath() {
    this.graph.ClearGraph();
    this.ReCreateAGraph();
    let path = this.graph.AStarSearch(this.graph, this.spawnMarker.position, this.endPosition);
    path.reverse();
    return path;
  }

  GetSpawnPoint() {
    // get Spawn Point Data
    let spawnBuildingObj = this.parent.getEntity(this.spawnBuilding);

    const spawnPointRoadCellData = spawnBuildingObj.GetNearestRoad();

    if (typeof spawnPointRoadCellData.entity_id === 'undefined') {
      return null;
    }
    this.spawnPointRoad = spawnPointRoadCellData.entity_id;
    let spawnPointRoadObj = this.parent.getEntity(spawnPointRoadCellData.entity_id);
    const spawnBuildingVector = new THREE.Vector3(
      spawnBuildingObj.position.x,
      spawnBuildingObj.position.y,
      spawnBuildingObj.position.z,
    );
    const distances = [];
    spawnPointRoadObj.pedestrianMarkers.forEach((marker) => {
      const markerVector = new THREE.Vector3(
        marker.position.x,
        marker.position.y,
        marker.position.z,
      );
      distances.push(spawnBuildingVector.manhattanDistanceTo(markerVector));
    });
    let minimum = Math.min(...distances);
    const markerIndex = distances.indexOf(minimum);
    this.spawnMarker = spawnPointRoadObj.pedestrianMarkers[markerIndex];
    this.position = new THREE.Vector3(
      this.spawnMarker.position.x,
      this.spawnMarker.position.y,
      this.spawnMarker.position.z,
    );

    // Get End Point Data
    let targetBuildingObj = this.parent.getEntity(this.targetLocation);
    const endPointRoadCellData = targetBuildingObj.GetNearestRoad();
    if (typeof endPointRoadCellData.entity_id === 'undefined') {
      return null;
    }
    this.endPointRoad = this.parent.getEntity(endPointRoadCellData.entity_id);

    const endPointBuildingVector = new THREE.Vector3(
      targetBuildingObj.position.x,
      targetBuildingObj.position.y,
      targetBuildingObj.position.z,
    );
    const endPointDistances = [];
    this.endPointRoad.pedestrianMarkers.forEach((marker) => {
      const markerVector = new THREE.Vector3(
        marker.position.x,
        marker.position.y,
        marker.position.z,
      );
      endPointDistances.push(endPointBuildingVector.manhattanDistanceTo(markerVector));
    });
    let endPointMinimum = Math.min(...endPointDistances);
    const endPointmarkerIndex = endPointDistances.indexOf(endPointMinimum);
    this.endPointMarker = this.endPointRoad.pedestrianMarkers[endPointmarkerIndex];
    this.endPosition = new THREE.Vector3(
      this.endPointMarker.position.x,
      this.endPointMarker.position.y,
      this.endPointMarker.position.z,
    );
  }

  GetTimeFromClock(clockTimeH, clockTimeM) {
    let timeH = clockTimeH * 60 * 60;
    let timeM = clockTimeM * 60;
    return timeH + timeM;
  }

  Update(delta, clockH, clockM) {
    if (this.job === null) {
      this.GetAJob();
      this.destinations.push(this.job);
      this.destinationGuiData = 'Work - ' + this.job;
    } else {
      let jobObj = this.parent.getEntity(this.job);
      let time = this.GetTimeFromClock(clockH, clockM);
      let sleepTimeEnd = this.GetTimeFromClock(this.sleepEndH, this.sleepEndM);
      let sleepStart = this.GetTimeFromClock(this.sleepStartH, this.sleepStartM);
      let goToSleep = this.GetTimeFromClock(this.sleepStartH - 1, this.sleepStartM);
      let goToWork = this.GetTimeFromClock(this.sleepEndH, this.setOffForWorkM);
      let finishWork = this.GetTimeFromClock(jobObj.levelData.shift_endH, this.finishWorkM);
      if (sleepTimeEnd < time) {
        // we should be awake
        this.sleeping = false;
        if (sleepStart <= time) {
          // we should be back asleep!
          this.sleeping = true;
          this.visible = false;
          this.moving = false;
        } else {
          if (goToSleep === time) {
            // we are an hour before sleep so no matter where we are we need to set target to go home.
            if (this.currentLocation !== 'home') {
              this.destinations.push(this.homeBuilding);
              this.targetLocation = this.destinations[0];
              this.GetSpawnPoint();
              let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
              if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
                this.CreatePathBetween();
                this.visible = true;
                this.moving = true;
              }
            }
          } else {
            // we are during normal daytime hours
            if (time === goToWork) {
              // we are in the hour before work so we need to set off to work
              this.destinations.push(this.job);
              this.targetLocation = this.destinations[0];
              this.spawnBuilding = this.homeBuilding;
              this.GetSpawnPoint();
              let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
              if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
                this.CreatePathBetween();
                this.visible = true;
                this.moving = true;
                this.parent.requiresUpdate = true;
              }
            } else if (time > goToWork && time < finishWork) {
              // we are at work!
            } else if (time === finishWork) {
              let jobWage = jobObj.levelData.wage / 7;
              jobWage = jobWage.toFixed(2);
              let tax = (jobWage / 100) * this.parent.taxRate;
              this.parent.gameFunds = this.parent.gameFunds + tax;
              let personWage = jobWage - tax;
              personWage = personWage.toFixed(2);
              let newFund = parseFloat(this.funds) + parseFloat(personWage);
              this.funds = newFund.toFixed(2);
              let newJobFunds = jobObj.current_funds - jobWage;
              jobObj.current_funds = newJobFunds.toFixed(2);
              this.parent.soundManager.playSound('fx_cashregister', false);
              // console.log(`sim ${this.id} was paid ${personWage} at ${this.job.id}`);
              for (var i = 0; i < 5; i++) {
                this.AddRandomDestination();
              }
              this.spawnBuilding = this.job;
              this.targetLocation = this.destinations[0];
              this.GetSpawnPoint();
              let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
              if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
                this.CreatePathBetween();
                this.visible = true;
                this.moving = true;
                this.parent.requiresUpdate = true;
              }
            }
          }
        }
      }
    }
  }

  AddRandomDestination() {
    if (Math.random() < 0.5) {
      this.destinations.push(this.homeBuilding);
    } else {
      if (this.parent.commercial.length > 0) {
        let commercialObj =
          this.parent.commercial[Math.floor(Math.random() * this.parent.commercial.length)];
        this.destinations.push(commercialObj.id);
      } else {
        this.destinations.push(this.homeBuilding);
      }
    }
  }

  AnimateUpdate(delta) {
    if (this.moving === false) {
      // if we are at home we can either be sleeping, ready to go to work or ready to go to a shop
      // we initially spawn without a job so if we dont have one then we need to check for one
      // if (this.job != null) {
      //   this.spawnBuilding = this.homeBuilding;
      //   this.targetLocation = this.destinations[0];
      //   this.GetSpawnPoint();
      //   let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
      //   if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
      //     this.CreatePathBetween();
      //     this.visible = true;
      //     this.moving = true;
      //     this.parent.requiresUpdate = true;
      //   }
      // }
    } else {
      if (this.agentPath !== null && typeof this.agentPath !== 'undefined') {
        if (this.agentPath.length > 0) {
          this.DoAgentMove(delta);
        } else {
          // we should end movement here but for now we are adding new destinations infinitely above
          this.visible = false;
          this.moving = false;
          this.parent.requiresUpdate = true;
        }
      }
    }
    return null;
  }

  DoAgentMove(delta) {
    let targetPosition = this.agentPath[0];
    targetPosition.y = 0.025;
    const distance = targetPosition.clone().sub(this.position);
    if (distance.lengthSq() > 0.001) {
      distance.normalize();
      distance.multiplyScalar(delta * this.speed);
      this.position.add(distance);
      let directionVector = targetPosition.clone().sub(this.position);
      directionVector.normalize();
      directionVector.multiplyScalar(delta * this.speed);
      const m = new THREE.Matrix4();
      this.direction.lookAt(
        new THREE.Vector3(0, 0, 0),
        directionVector,
        new THREE.Vector3(0, 1, 0),
      );
    } else {
      this.agentPath.shift();
      if (this.agentPath.length === 0 && this.endMovement === false) {
        this.destinations.shift();

        // temporary add looped destination
        // if (this.targetLocation === this.homeBuilding) {
        //   this.destinations.push(this.job);
        // } else {
        //   this.destinations.push(this.homeBuilding);
        // }

        if (this.destinations.length > 0) {
          this.spawnBuilding = this.targetLocation;
          this.UpdateCurrentLocation();
          this.targetLocation = this.destinations[0];
          this.UpdateDestinationData();
          this.GetSpawnPoint();
          let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
          if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
            this.CreatePathBetween();
            // this.visible = true;
            // this.moving = true;
            this.parent.requiresUpdate = true;
          }
        } else {
          // we should end movement here but for now we are adding new destinations infinitely above
          this.visible = false;
          this.moving = false;
          this.parent.requiresUpdate = true;
        }
      }
    }
  }

  UpdateDestinationData() {
    if (this.destinations[0] === this.job) {
      this.destinationGuiData = 'Work - ' + this.job;
    } else if (this.destinations[0] === this.homeBuilding) {
      this.destinationGuiData = 'Home - ' + this.homeBuilding;
    } else {
      let destinationObj = this.parent.getEntity(this.destinations[0]);
      this.destinationGuiData = `${destinationObj.type} - ${this.destinations[0]}`;
    }
  }

  UpdateCurrentLocation() {
    if (this.spawnBuilding === this.job) {
      this.currentLocation = 'Work';
    } else if (this.spawnBuilding === this.homeBuilding) {
      this.currentLocation = 'Home';
    } else {
      let spawnBuildingObj = this.parent.getEntity(this.spawnBuilding);
      this.destinationGuiData = `${spawnBuildingObj.type} - ${this.spawnBuilding}`;
    }
  }

  UpdateAnimation(animation) {
    this.animation = animation;
  }
}

export default Person;
