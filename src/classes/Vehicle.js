import * as THREE from 'three';
import * as PF from 'pathfinding';
import Entity from './Entity';
import AdjacencyGraph from './AdjacencyGraph.js';

const vehicleModels = ['car', 'hatchback'];

class Vehicle extends Entity {
  constructor(params) {
    super(params);
    this.rotation = new THREE.Quaternion();
    this.direction = new THREE.Matrix4();
    this.scale = [0.006, 0.006, 0.006];
    this.spawnBuilding = params.spawnBuilding;
    this.homeBuilding = params.spawnBuilding;
    if (params.hasOwnProperty('targetBuilding')) {
      this.target = params.targetBuilding;
    } else {
      this.target = null;
    }
    if (typeof params.funds !== 'undefined') {
      this.funds = params.funds;
    }
    if (typeof params.destinations !== 'undefined') {
      this.destinations = params.destinations;
    } else {
      this.destinations = [];
    }
    this.parent.vehicles.push(this);
    this.endMovement = false;
    this.agentPath = null;
    this.graph = new AdjacencyGraph();
    this.gridPath = null;
    this.baseSpeed = 1.0;
    this.speed = this.baseSpeed;
    this.visible = true;
    this.moving = false;
    this.updateGraph = false;
    if (params.hasOwnProperty('vehicleModel')) {
      this.vehicleModel = params.vehicleModel;
    } else {
      this.vehicleModel = this.GetVehicleModel();
    }
    if (params.hasOwnProperty('cargo')) {
      this.cargo = params.cargo;
      this.cargoCost = params.cargoCost;
      this.batchId = params.batchId;
    } else {
      this.cargo = null;
      this.cargoCost = 0;
      this.batchId = null;
    }
    this.carPath = [];
    this.SpawnCar();
    if (this.agentPath != null && this.agentPath.length > 0) {
      this.visible = true;
      this.moving = true;
      this.parent.requiresUpdate = true;
    }
    this.rotationY = Math.Pi * 2;
  }

  GetVehicleModel() {
    return vehicleModels[this.RandomIntFromInterval(0, vehicleModels.length - 1)];
  }

  GetCarPath(path, startPosition, endPosition) {
    this.graph.ClearGraph();
    this.CreateAGraph(path);
    let agentPath = this.graph.AStarSearch(this.graph, startPosition, endPosition);
    agentPath.reverse();
    return agentPath;
  }

  SpawnCar() {
    let startBuilding = this.parent.getEntity(this.spawnBuilding);
    let targetBuilding = this.parent.getEntity(this.destinations[0]);
    this.target = this.destinations[0];
    this.TrySpawnACar(startBuilding, targetBuilding);
  }

  TrySpawnACar(startBuilding, endBuilding) {
    if (startBuilding != null && endBuilding != null) {
      const startRoad = this.GetConnectedRoadForPosition(startBuilding);
      const endRoad = this.GetConnectedRoadForPosition(endBuilding);
      if (startRoad != null && endRoad != null) {
        let path = this.CreatePathBetween(startRoad, endRoad);
        if (path.length > 0 && path.length > 1) {
          let startMarkerPos = this.GetCarSpawnMarker(startRoad, startBuilding, path[1]).clone();
          this.position = startMarkerPos;
          let endMarkerPos = this.GetCarEndMarker(
            endRoad,
            endBuilding,
            path[path.length - 2],
          ).clone();
          let carRoadPath = this.GetCarPath(path, startMarkerPos, endMarkerPos);
          if (carRoadPath.length > 0) {
            this.agentPath = carRoadPath;
          } else {
            this.endMovement = true;
            this.parent.removeEntity(this.id);
            this.parent.vehicles = this.parent.vehicles.filter((vehicle) => vehicle.id !== this.id);
            this.parent.requiresUpdate = true;
          }
          return null;
        } else {
          this.endMovement = true;
          this.parent.removeEntity(this.id);
          this.parent.vehicles = this.parent.vehicles.filter((vehicle) => vehicle.id !== this.id);
          this.parent.requiresUpdate = true;
          return null;
        }
      }
    }
  }

  CreatePathBetween(startRoad, endRoad) {
    const roadsGrid = this.parent.roadsGrid;
    let startNode = roadsGrid.getNodeAt(startRoad.gridPos[0], startRoad.gridPos[1]);
    let endNode = roadsGrid.getNodeAt(endRoad.gridPos[0], endRoad.gridPos[1]);

    let gridBackup = roadsGrid.clone();
    const finder = new PF.AStarFinder();
    let gridPath = finder.findPath(startNode.x, startNode.y, endNode.x, endNode.y, gridBackup);
    if (gridPath.length > 0) {
      return gridPath;
    }
    return null;
  }

  GetCarSpawnMarker(road, startBuilding, nextPosition) {
    return road.GetPositionForCarToSpawn(nextPosition, startBuilding);
  }

  GetCarEndMarker(road, endBuilding, prevPosition) {
    return road.GetPositionForCarToEnd(prevPosition, endBuilding);
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

  GetConnectedRoadForPosition(building) {
    let connected = building.GetConnected();
    if (connected.up === true) {
      const cellKey = this.grid.Key(building.gridPos[0], building.gridPos[1] - 1);
      const cell = this.grid.GetCellByKey(cellKey);
      if (cell.type === 'ROAD') {
        let cellRoad = null;
        cell.set.forEach((entity) => {
          if (entity.type === 'road') {
            cellRoad = entity;
          }
        });
        return this.parent.getEntity(cellRoad.entity_id);
      }
    }
    if (connected.down === true) {
      const cellKey = this.grid.Key(building.gridPos[0], building.gridPos[1] + 1);
      const cell = this.grid.GetCellByKey(cellKey);
      if (cell.type === 'ROAD') {
        let cellRoad = null;
        cell.set.forEach((entity) => {
          if (entity.type === 'road') {
            cellRoad = entity;
          }
        });
        return this.parent.getEntity(cellRoad.entity_id);
      }
    }
    if (connected.left === true) {
      const cellKey = this.grid.Key(building.gridPos[0] - 1, building.gridPos[1]);
      const cell = this.grid.GetCellByKey(cellKey);
      if (cell.type === 'ROAD') {
        let cellRoad = null;
        cell.set.forEach((entity) => {
          if (entity.type === 'road') {
            cellRoad = entity;
          }
        });
        return this.parent.getEntity(cellRoad.entity_id);
      }
    }
    if (connected.right === true) {
      const cellKey = this.grid.Key(building.gridPos[0] + 1, building.gridPos[1]);
      const cell = this.grid.GetCellByKey(cellKey);
      if (cell.type === 'ROAD') {
        let cellRoad = null;
        cell.set.forEach((entity) => {
          if (entity.type === 'road') {
            cellRoad = entity;
          }
        });
        return this.parent.getEntity(cellRoad.entity_id);
      }
    }
  }

  CreateAGraph(path) {
    let tempDictionary = new Map();
    for (let i = 0; i < path.length; i++) {
      const currentPosition = path[i];
      const roadStructure = this.GetRoadAtGridPosition(currentPosition);
      const markersList = [...roadStructure.carMarkers];
      tempDictionary.clear();

      let limitDistance = false;
      if (markersList.length > 3) {
        limitDistance = true;
      }
      markersList.forEach((marker) => {
        this.graph.AddVertexByPosition(marker.position);
        const neighbours = marker.GetAdjacentPositions();
        neighbours.forEach((neighbour) => {
          this.graph.AddEdge(marker.position, neighbour);
        });
        let nextStep = i + 1;
        if (marker.open && nextStep < path.length) {
          let nextRoad = this.GetRoadAtGridPosition(path[nextStep]);
          let nextMarker = nextRoad.GetClosestVehicleMarkerTo(marker.position);
          if (limitDistance === true) {
            tempDictionary.set(marker, {
              marker: marker,
              nextMarker: nextMarker,
            });
          } else {
            this.graph.AddEdge(marker.position, nextMarker.position);
          }
        }
      });

      if (limitDistance) {
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

  Update(delta) {
    if (this.agentPath !== null && typeof this.agentPath !== 'undefined') {
      if (this.agentPath.length > 0) {
        let targetPosition = this.agentPath[0];
        targetPosition.y = 0.025;
        const distance = targetPosition.clone().sub(this.position);
        if (distance.lengthSq() > 0.001) {
          distance.normalize();
          distance.multiplyScalar(delta * this.speed);
          this.position.add(distance);
          let directionVector = this.position.clone().sub(targetPosition);
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
          if (this.agentPath.length === 0) {
            if (this.cargo !== null) {
              let target = this.parent.getEntity(this.target);
              target.stock = target.stock + this.cargo;
              this.cargo = null;
              let tax = (this.cargoCost / 100) * this.parent.taxRate;
              let newBatchCost = this.cargoCost - tax;
              newBatchCost = newBatchCost.toFixed(2);
              let newFunds = parseFloat(target.current_funds) + parseFloat(this.cargoCost);
              target.current_fund = newFunds.toFixed(2);
              let home = this.parent.getEntity(this.homeBuilding);

              home.funds += newBatchCost;
              this.parent.gameFunds += tax;
              this.parent.soundManager.playSound('fx_cashregister', false);
              this.parent.requiresUpdate = true;
            }

            this.destinations.shift();

            if (this.destinations.length > 0) {
              this.spawnBuilding = this.target;
              this.SpawnCar();
            } else {
              this.endMovement = true;
              this.visible = false;
              this.parent.removeEntity(this.id);
              this.parent.vehicles = this.parent.vehicles.filter(
                (vehicle) => vehicle.id !== this.id,
              );
              this.parent.requiresUpdate = true;
            }
          }
        }
      }
    }
    return null;
  }
}

export default Vehicle;
