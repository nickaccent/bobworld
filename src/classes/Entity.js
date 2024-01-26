import * as THREE from 'three';
import uuid from 'react-uuid';

class Entity {
  constructor(params) {
    this.id = uuid();
    this.parent = params.parent;
    this.type = params.type;
    this.w = params.w;
    this.d = params.d;
    this.components = null;
    this.position = new THREE.Vector3(params.x, params.y, params.z);
    this.rotation = new THREE.Quaternion();
    this.rotationY = 0;
    this.handlers = {};
    this.grid = params.grid;
    this.scale = [0.006, 0.006, 0.006];
    this.positionModifier = [0, 0.02, 0];
    let wHalf = Math.floor(this.w / 2);
    let dHalf = Math.floor(this.d / 2);
    this.gridPos = [Math.floor(this.position.x) + wHalf, Math.floor(this.position.z) + dHalf];
    this.client = this.grid.NewClient(this.gridPos, [1, 1], this.IsWalkable(), this.id, this.type);
    this.buildingModel = null;
    this.connected = this.GetConnected();
    this.remove = false;
  }

  GetConnected() {
    const bounds = [1, 1];
    const nearbyItems = this.grid.FindNear(this.client.position, bounds);
    let connections = {
      left: false,
      right: false,
      up: false,
      down: false,
      rotate: false,
    };
    for (let cell of nearbyItems) {
      let cellX = cell.indices[0];
      let cellY = cell.indices[1];
      let entityX = this.client.indices[0];
      let entityY = this.client.indices[1];
      if (cell.type === 'road') {
        if (cellX < entityX && cellY === entityY) {
          if (connections.left === false) {
            connections.left = true;
          }
        }
        if (cellX > entityX && cellY === entityY) {
          if (connections.right === false) {
            connections.right = true;
          }
        }
        if (cellY > entityY && cellX === entityX) {
          if (connections.down === false) {
            connections.down = true;
          }
        }
        if (cellY < entityY && cellX === entityX) {
          if (connections.up === false) {
            connections.up = true;
          }
        }
      }
    }

    this.connected = connections;
    return connections;
  }

  IsWalkable() {
    if (this.type === 'road') {
      return true;
    }
    return false;
  }

  SetParent(p) {
    this.parent = p;
  }
  SetName(n) {
    this.name = n;
  }
  SetPosition(p) {
    this.position.copy(p);
  }
  SetQuaternion(r) {
    this.rotation.copy(r);
  }
  RandomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

export default Entity;
