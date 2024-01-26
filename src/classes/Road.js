import * as THREE from 'three';
import Entity from './Entity';
import Marker from './Marker';

class Road extends Entity {
  constructor(params) {
    super(params);
    this.extras = [];
    this.pedestrianMarkers = [];
    this.carMarkers = [];
    this.rotation = new THREE.Quaternion();
    this.rotationY = 0;
    this.scale = [0.006, 0.006, 0.006];
    this.positionModifier = [0, 0.02, 0];
    this.slModel = 'streetLight';
    this.tlModel = 'trafficLight';
    this.buildingModel = 'roadStraight';
    this.scale = [0.005, 0.005, 0.005];
    this.roadPosition = [this.position.x, -0.045, this.position.z];
    this.isCorner = false;
    this.approxThresholdCorner = 0.3;
    this.taxCost = 10.0;
    this.RoadFix();
  }

  AddToParentArray() {
    this.parent.roads.push(this);
  }

  RoadFix() {
    let connections = this.GetConnected();
    if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      this.buildingModel = 'roadEnd';
      this.rotationY = (Math.PI / 2) * 2;
      this.isCorner = false;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      this.buildingModel = 'roadEnd';
      this.rotationY = (Math.PI / 2) * 4;
      this.isCorner = false;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      this.buildingModel = 'roadEnd';
      this.rotationY = (Math.PI / 2) * 2;
      this.isCorner = false;
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      this.buildingModel = 'roadEnd';
      this.rotationY = (Math.PI / 2) * 1;
      this.isCorner = false;
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      this.buildingModel = 'roadEnd';
      this.rotationY = (Math.PI / 2) * 3;
      this.isCorner = false;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === true &&
      connections.rotate === false
    ) {
      this.buildingModel = 'roadStraight';
      this.isCorner = false;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === true &&
      connections.rotate === true
    ) {
      this.buildingModel = 'roadStraight';
      this.rotationY = (Math.PI / 2) * 2;
      this.isCorner = false;
    } else if (
      connections.left === false &&
      connections.right === false &&
      connections.up === true &&
      connections.down === true &&
      connections.rotate === false
    ) {
      this.buildingModel = 'roadStraight';
      this.rotationY = Math.PI / 2;
      this.isCorner = false;
    } else if (
      connections.left === false &&
      connections.right === false &&
      connections.up === true &&
      connections.down === true &&
      connections.rotate === true
    ) {
      this.buildingModel = 'roadStraight';
      this.rotationY = (Math.PI / 2) * 3;
      this.isCorner = false;
    } else if (
      connections.left === true &&
      connections.down === true &&
      connections.up === false &&
      connections.right === false
    ) {
      this.buildingModel = 'roadCurve';
      this.rotationY = (Math.PI / 2) * 3;
      this.isCorner = true;
    } else if (
      connections.right === true &&
      connections.down === true &&
      connections.up === false &&
      connections.left === false
    ) {
      this.buildingModel = 'roadCurve';
      this.rotationY = (Math.PI / 2) * 4;
      this.isCorner = true;
    } else if (
      connections.right === true &&
      connections.up === true &&
      connections.down === false &&
      connections.left === false
    ) {
      this.buildingModel = 'roadCurve';
      this.rotationY = (Math.PI / 2) * 1;
      this.isCorner = true;
    } else if (
      connections.left === true &&
      connections.up === true &&
      connections.down === false &&
      connections.right === false
    ) {
      this.buildingModel = 'roadCurve';
      this.rotationY = (Math.PI / 2) * 2;
      this.isCorner = true;
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === true &&
      connections.down === false
    ) {
      this.buildingModel = 'roadThreeWay';
      this.rotationY = (Math.PI / 2) * 3;
      this.isCorner = false;
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.down === true &&
      connections.up === false
    ) {
      this.buildingModel = 'roadThreeWay';
      this.rotationY = Math.PI / 2;
      this.isCorner = false;
    } else if (
      connections.left === true &&
      connections.up === true &&
      connections.down === true &&
      connections.right === false
    ) {
      this.buildingModel = 'roadThreeWay';
      this.rotationY = (Math.PI / 2) * 4;
      this.isCorner = false;
    } else if (
      connections.right === true &&
      connections.up === true &&
      connections.down === true &&
      connections.left === false
    ) {
      this.buildingModel = 'roadThreeWay';
      this.rotationY = (Math.PI / 2) * 2;
      this.isCorner = false;
    } else if (
      connections.right === true &&
      connections.up === true &&
      connections.down === true &&
      connections.left === true
    ) {
      this.buildingModel = 'roadFourWay';
      this.isCorner = false;
    }
    this.SetRoadExtras(connections);
    this.SetRoadPedestrianMarkers(connections);
    this.SetRoadCarMarkers(connections);
  }

  SetRoadExtras(connections) {
    this.extras = [];
    // if (
    //   connections.up === false &&
    //   connections.down === false &&
    //   connections.left === false &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.up === false &&
    //   connections.down === false &&
    //   connections.left === false &&
    //   connections.right === true
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.up === false &&
    //   connections.down === false &&
    //   connections.left === true &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.up === true &&
    //   connections.down === false &&
    //   connections.left === false &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.up === false &&
    //   connections.down === true &&
    //   connections.left === false &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.up === false &&
    //   connections.down === false &&
    //   connections.left === true &&
    //   connections.right === true
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.left === false &&
    //   connections.right === false &&
    //   connections.up === true &&
    //   connections.down === true
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.left === true &&
    //   connections.down === true &&
    //   connections.up === false &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.35],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.right === true &&
    //   connections.down === true &&
    //   connections.up === false &&
    //   connections.left === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.35],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.right === true &&
    //   connections.up === true &&
    //   connections.down === false &&
    //   connections.left === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.3, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.2, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.left === true &&
    //   connections.up === true &&
    //   connections.down === false &&
    //   connections.right === false
    // ) {
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] - 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'streetlight',
    //     model: this.slModel,
    //     position: [this.roadPosition[0] - 0.15, 0.01, this.roadPosition[2] + 0.25],
    //     scale: [0.0035, 0.003, 0.0035],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    // } else if (
    //   connections.left === true &&
    //   connections.right === true &&
    //   connections.up === true &&
    //   connections.down === false
    // ) {
    //   let extra = {
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] + 0.2, 0.01, this.roadPosition[2] - 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 1,
    //   };
    //   this.extras.push(extra);
    // } else if (
    //   connections.left === true &&
    //   connections.right === true &&
    //   connections.down === true &&
    //   connections.up === false
    // ) {
    //   let extra = {
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] - 0.2, 0.01, this.roadPosition[2] + 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 3,
    //   };
    //   this.extras.push(extra);
    // } else if (
    //   connections.left === true &&
    //   connections.up === true &&
    //   connections.down === true &&
    //   connections.right === false
    // ) {
    //   let extra = {
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] - 0.2, 0.01, this.roadPosition[2] - 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 2,
    //   };
    //   this.extras.push(extra);
    // } else if (
    //   connections.right === true &&
    //   connections.up === true &&
    //   connections.down === true &&
    //   connections.left === false
    // ) {
    //   let extra = {
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] + 0.2, 0.01, this.roadPosition[2] + 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 4,
    //   };
    //   this.extras.push(extra);
    // } else if (
    //   connections.right === true &&
    //   connections.up === true &&
    //   connections.down === true &&
    //   connections.left === true
    // ) {
    //   this.extras.push({
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] + 0.2, 0.01, this.roadPosition[2] + 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 4,
    //   });
    //   this.extras.push({
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] - 0.2, 0.01, this.roadPosition[2] - 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 2,
    //   });
    //   this.extras.push({
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] + 0.2, 0.01, this.roadPosition[2] - 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 1,
    //   });
    //   this.extras.push({
    //     type: 'trafficlight',
    //     model: this.tlModel,
    //     position: [this.roadPosition[0] - 0.2, 0.01, this.roadPosition[2] + 0.2],
    //     scale: [0.003, 0.003, 0.003],
    //     rotationY: (Math.PI / 2) * 3,
    //   });
    // }
  }

  SetRoadPedestrianMarkers(connections) {
    this.pedestrianMarkers = [];
    if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.0],
        false,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + -0.35],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m1.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m1);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.0],
        false,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + -0.35],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m1.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m1);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.0],
        false,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + -0.35],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m1.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m1);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.0, 0.01, this.roadPosition[2] + 0.35],
        false,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + -0.35, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m1.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m1);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.0, 0.01, this.roadPosition[2] + -0.35],
        false,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + -0.35],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + -0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m1.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m1);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === true &&
      connections.rotate === false
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0, 0.01, this.roadPosition[2] - 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === true &&
      connections.rotate === true
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0, 0.01, this.roadPosition[2] - 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
    } else if (
      connections.left === false &&
      connections.right === false &&
      connections.up === true &&
      connections.down === true &&
      connections.rotate === false
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] - 0.0], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.0], true, null),
      );
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === true &&
      connections.down === false &&
      connections.rotate === true
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + -0.35], true, null),
      );
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === false &&
      connections.down === true
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + -0.35], true, null),
      );
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === false &&
      connections.down === true
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + -0.35], true, null),
      );
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === true &&
      connections.down === false
    ) {
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.35], true, null),
      );
      this.pedestrianMarkers.push(
        new Marker([this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + -0.35], true, null),
      );
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      m1.adjacentMarkers.push(m3);
      m1.adjacentMarkers.push(m4);
      m2.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m4);
      m3.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m1);
      m4.adjacentMarkers.push(m2);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
      this.pedestrianMarkers.push(m4);
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      m1.adjacentMarkers.push(m3);
      m1.adjacentMarkers.push(m4);
      m2.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m4);
      m3.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m1);
      m4.adjacentMarkers.push(m2);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
      this.pedestrianMarkers.push(m4);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === false &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      m1.adjacentMarkers.push(m3);
      m1.adjacentMarkers.push(m4);
      m2.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m4);
      m3.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m1);
      m4.adjacentMarkers.push(m2);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
      this.pedestrianMarkers.push(m4);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === true &&
      connections.down === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      m1.adjacentMarkers.push(m3);
      m1.adjacentMarkers.push(m4);
      m2.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m4);
      m3.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m1);
      m4.adjacentMarkers.push(m2);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
      this.pedestrianMarkers.push(m4);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.25, 0.01, this.roadPosition[2] + -0.25],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.25, 0.01, this.roadPosition[2] + 0.25],
        true,
        null,
      );
      m1.adjacentMarkers.push(m3);
      m1.adjacentMarkers.push(m4);
      m2.adjacentMarkers.push(m3);
      m2.adjacentMarkers.push(m4);
      m3.adjacentMarkers.push(m1);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m1);
      m4.adjacentMarkers.push(m2);
      this.pedestrianMarkers.push(m1);
      this.pedestrianMarkers.push(m2);
      this.pedestrianMarkers.push(m3);
      this.pedestrianMarkers.push(m4);
    }
  }

  SetRoadCarMarkers(connections) {
    this.carMarkers = [];
    if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + -0.065],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + 0.065],
        true,
        false,
      );
      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + -0.065],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + 0.065],
        true,
        false,
      );
      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + 0.065],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.0, 0.01, this.roadPosition[2] + -0.065],
        true,
        false,
      );
      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.0],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.0],
        true,
        false,
      );
      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.0],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.0],
        true,
        false,
      );
      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === true
    ) {
      this.carMarkers.push(
        new Marker(
          [this.roadPosition[0] + 0, 0.01, this.roadPosition[2] - 0.065],
          true,
          null,
          'left',
        ),
      );
      this.carMarkers.push(
        new Marker(
          [this.roadPosition[0] - 0, 0.01, this.roadPosition[2] + 0.065],
          true,
          null,
          'right',
        ),
      );
    } else if (
      connections.up === true &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      this.carMarkers.push(
        new Marker(
          [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.0],
          true,
          null,
          'left',
        ),
      );
      this.carMarkers.push(
        new Marker(
          [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.0],
          true,
          null,
          'right',
        ),
      );
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === true &&
      connections.down === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.17, 0.015, this.roadPosition[2] - 0.17],
        false,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.35],
        true,
        null,
      );

      //---
      let m4 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
      );
      let m5 = new Marker(
        [this.roadPosition[0] - 0.12, 0.015, this.roadPosition[2] - 0.03],
        false,
        null,
      );
      let m6 = new Marker(
        [this.roadPosition[0] + 0.02, 0.015, this.roadPosition[2] - 0.18],
        false,
        null,
      );
      let m7 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m2.adjacentMarkers.push(m1);
      m2.adjacentMarkers.push(m3);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m5);
      m5.adjacentMarkers.push(m4);
      m5.adjacentMarkers.push(m6);
      m6.adjacentMarkers.push(m5);
      m6.adjacentMarkers.push(m7);
      m7.adjacentMarkers.push(m6);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === false &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] - 0.065],
        true,
        true,
      );
      let m2 = new Marker(
        [this.roadPosition[0] - 0.15, 0.015, this.roadPosition[2] + 0.0],
        false,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.0, 0.015, this.roadPosition[2] + 0.15],
        false,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );

      //---
      let m5 = new Marker(
        [this.roadPosition[0] - 0.35, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
      );
      let m6 = new Marker(
        [this.roadPosition[0] - 0.17, 0.015, this.roadPosition[2] + 0.17],
        false,
        null,
      );

      let m7 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );

      m1.adjacentMarkers.push(m2);
      m2.adjacentMarkers.push(m1);
      m2.adjacentMarkers.push(m3);
      m3.adjacentMarkers.push(m2);
      m3.adjacentMarkers.push(m4);
      m4.adjacentMarkers.push(m3);
      m5.adjacentMarkers.push(m6);
      m6.adjacentMarkers.push(m5);
      m6.adjacentMarkers.push(m7);
      m7.adjacentMarkers.push(m6);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === false &&
      connections.down === true
    ) {
      // Current
      let m1 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.15, 0.015, this.roadPosition[2] + 0.0],
        false,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.0, 0.015, this.roadPosition[2] + 0.15],
        false,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );

      //---
      let m5 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
      );
      let m6 = new Marker(
        [this.roadPosition[0] + 0.17, 0.015, this.roadPosition[2] + 0.17],
        false,
        null,
      );

      let m7 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.35],
        true,
        null,
      );

      m1.adjacentMarkers.push(m2);
      m2.adjacentMarkers.push(m1);
      m2.adjacentMarkers.push(m3);
      m3.adjacentMarkers.push(m2);
      m3.adjacentMarkers.push(m4);
      m4.adjacentMarkers.push(m3);
      m5.adjacentMarkers.push(m6);
      m6.adjacentMarkers.push(m5);
      m6.adjacentMarkers.push(m7);
      m7.adjacentMarkers.push(m6);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === true &&
      connections.down === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.17, 0.015, this.roadPosition[2] - 0.17],
        false,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.35],
        true,
        null,
      );

      //---
      let m4 = new Marker(
        [this.roadPosition[0] + 0.35, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
      );
      let m5 = new Marker(
        [this.roadPosition[0] + 0.12, 0.015, this.roadPosition[2] - 0.03],
        false,
        null,
      );
      let m6 = new Marker(
        [this.roadPosition[0] - 0.02, 0.015, this.roadPosition[2] - 0.18],
        false,
        null,
      );
      let m7 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.35],
        true,
        null,
      );
      m1.adjacentMarkers.push(m2);
      m2.adjacentMarkers.push(m1);
      m2.adjacentMarkers.push(m3);
      m3.adjacentMarkers.push(m2);
      m4.adjacentMarkers.push(m5);
      m5.adjacentMarkers.push(m4);
      m5.adjacentMarkers.push(m6);
      m6.adjacentMarkers.push(m5);
      m6.adjacentMarkers.push(m7);
      m7.adjacentMarkers.push(m6);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
    } else if (
      connections.left === false &&
      connections.right === true &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
      );
      let m5 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
      );
      let m6 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
      );

      let m7 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
      );
      let m8 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
      );
      let m9 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
      );
      let m10 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
      );
      m1.adjacentMarkers.push(m7);
      m2.adjacentMarkers.push(m8);
      m3.adjacentMarkers.push(m8);
      m4.adjacentMarkers.push(m9);
      m5.adjacentMarkers.push(m9);
      m6.adjacentMarkers.push(m10);

      m7.adjacentMarkers.push(m1);
      m7.adjacentMarkers.push(m9);
      m7.adjacentMarkers.push(m10);

      m8.adjacentMarkers.push(m2);
      m8.adjacentMarkers.push(m3);
      m8.adjacentMarkers.push(m9);
      m8.adjacentMarkers.push(m10);

      m9.adjacentMarkers.push(m4);
      m9.adjacentMarkers.push(m5);
      m9.adjacentMarkers.push(m7);
      m9.adjacentMarkers.push(m8);

      m10.adjacentMarkers.push(m6);
      m10.adjacentMarkers.push(m7);
      m10.adjacentMarkers.push(m8);

      this.carMarkers.push(m1); // top left
      this.carMarkers.push(m2); // top right
      this.carMarkers.push(m3); // right top
      this.carMarkers.push(m4); // right bottom
      this.carMarkers.push(m5); // bottom left
      this.carMarkers.push(m6); // bottom right

      this.carMarkers.push(m7); // middle-top left
      this.carMarkers.push(m8); // middle-top-right
      this.carMarkers.push(m9); // middle-botton right
      this.carMarkers.push(m10); // middle-botton left
    } else if (
      connections.left === true &&
      connections.right === false &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
        false,
      );
      let m3 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
        false,
      );
      let m4 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m5 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );
      let m6 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );
      let m7 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      let m8 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m9 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m10 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );

      m1.adjacentMarkers.push(m7);
      m2.adjacentMarkers.push(m8);
      m3.adjacentMarkers.push(m9);
      m4.adjacentMarkers.push(m9);
      m5.adjacentMarkers.push(m10);
      m6.adjacentMarkers.push(m10);
      m7.adjacentMarkers.push(m1);
      m7.adjacentMarkers.push(m8);
      m7.adjacentMarkers.push(m9);
      m8.adjacentMarkers.push(m2);
      m8.adjacentMarkers.push(m7);
      m8.adjacentMarkers.push(m10);
      m9.adjacentMarkers.push(m3);
      m9.adjacentMarkers.push(m4);
      m9.adjacentMarkers.push(m7);
      m9.adjacentMarkers.push(m10);
      m10.adjacentMarkers.push(m5);
      m10.adjacentMarkers.push(m6);
      m10.adjacentMarkers.push(m8);
      m10.adjacentMarkers.push(m9);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
      this.carMarkers.push(m8);
      this.carMarkers.push(m9);
      this.carMarkers.push(m10);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === false &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
        false,
      );
      let m4 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
        false,
      );
      let m5 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m6 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );

      let m7 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      let m8 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m9 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m10 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );

      m1.adjacentMarkers.push(m7);
      m2.adjacentMarkers.push(m8);
      m3.adjacentMarkers.push(m8);
      m4.adjacentMarkers.push(m9);
      m5.adjacentMarkers.push(m9);
      m6.adjacentMarkers.push(m10);
      m7.adjacentMarkers.push(m1);
      m7.adjacentMarkers.push(m9);
      m7.adjacentMarkers.push(m10);
      m8.adjacentMarkers.push(m2);
      m8.adjacentMarkers.push(m3);
      m8.adjacentMarkers.push(m9);
      m8.adjacentMarkers.push(m10);
      m9.adjacentMarkers.push(m4);
      m9.adjacentMarkers.push(m5);
      m9.adjacentMarkers.push(m7);
      m9.adjacentMarkers.push(m8);
      m10.adjacentMarkers.push(m6);
      m10.adjacentMarkers.push(m7);
      m10.adjacentMarkers.push(m8);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
      this.carMarkers.push(m8);
      this.carMarkers.push(m9);
      this.carMarkers.push(m10);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === true &&
      connections.down === false
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );

      let m3 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m4 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );
      let m5 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );
      let m6 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );

      let m7 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      let m8 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m9 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m10 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      m1.adjacentMarkers.push(m7);
      m2.adjacentMarkers.push(m8);
      m3.adjacentMarkers.push(m9);
      m4.adjacentMarkers.push(m10);
      m5.adjacentMarkers.push(m10);
      m6.adjacentMarkers.push(m7);
      m7.adjacentMarkers.push(m1);
      m7.adjacentMarkers.push(m6);
      m7.adjacentMarkers.push(m9);
      m8.adjacentMarkers.push(m10);
      m8.adjacentMarkers.push(m2);
      m8.adjacentMarkers.push(m9);
      m8.adjacentMarkers.push(m10);
      m9.adjacentMarkers.push(m3);
      m9.adjacentMarkers.push(m7);
      m9.adjacentMarkers.push(m8);
      m10.adjacentMarkers.push(m4);
      m10.adjacentMarkers.push(m5);
      m10.adjacentMarkers.push(m7);
      m10.adjacentMarkers.push(m8);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
      this.carMarkers.push(m8);
      this.carMarkers.push(m9);
      this.carMarkers.push(m10);
    } else if (
      connections.left === true &&
      connections.right === true &&
      connections.up === true &&
      connections.down === true
    ) {
      let m1 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );
      let m2 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.4],
        true,
        null,
        false,
      );
      let m3 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );
      let m4 = new Marker(
        [this.roadPosition[0] + 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m5 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
        false,
      );
      let m6 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.4],
        true,
        null,
      );
      let m7 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] + 0.065],
        true,
        null,
        false,
      );
      let m8 = new Marker(
        [this.roadPosition[0] - 0.4, 0.01, this.roadPosition[2] - 0.065],
        true,
        null,
        false,
      );

      let m9 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      let m10 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] - 0.065],
        false,
        null,
        false,
      );
      let m11 = new Marker(
        [this.roadPosition[0] + 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );
      let m12 = new Marker(
        [this.roadPosition[0] - 0.065, 0.01, this.roadPosition[2] + 0.065],
        false,
        null,
        false,
      );

      m1.adjacentMarkers.push(m9);
      m2.adjacentMarkers.push(m10);
      m3.adjacentMarkers.push(m10);
      m4.adjacentMarkers.push(m11);
      m5.adjacentMarkers.push(m11);
      m6.adjacentMarkers.push(m12);
      m7.adjacentMarkers.push(m12);
      m8.adjacentMarkers.push(m9);
      m9.adjacentMarkers.push(m1);
      m9.adjacentMarkers.push(m8);
      m9.adjacentMarkers.push(m10);
      m9.adjacentMarkers.push(m11);
      m9.adjacentMarkers.push(m12);
      m10.adjacentMarkers.push(m2);
      m10.adjacentMarkers.push(m3);
      m10.adjacentMarkers.push(m9);
      m10.adjacentMarkers.push(m11);
      m10.adjacentMarkers.push(m12);
      m11.adjacentMarkers.push(m4);
      m11.adjacentMarkers.push(m5);
      m11.adjacentMarkers.push(m9);
      m11.adjacentMarkers.push(m10);
      m11.adjacentMarkers.push(m12);
      m12.adjacentMarkers.push(m6);
      m12.adjacentMarkers.push(m7);
      m12.adjacentMarkers.push(m9);
      m12.adjacentMarkers.push(m10);
      m12.adjacentMarkers.push(m11);

      this.carMarkers.push(m1);
      this.carMarkers.push(m2);
      this.carMarkers.push(m3);
      this.carMarkers.push(m4);
      this.carMarkers.push(m5);
      this.carMarkers.push(m6);
      this.carMarkers.push(m7);
      this.carMarkers.push(m8);
      this.carMarkers.push(m9);
      this.carMarkers.push(m10);
      this.carMarkers.push(m11);
      this.carMarkers.push(m12);
    }
  }

  GetClosestMarkerTo(structurePosition) {
    let closestMarker = null;
    if (this.isCorner) {
      for (const [index, marker] of this.pedestrianMarkers.entries()) {
        let direction = new THREE.Vector3();
        direction.subVectors(marker.position, structurePosition).normalize();
        if (
          Math.abs(direction.x) < this.approxThresholdCorner ||
          Math.abs(direction.z) < this.approxThresholdCorner
        ) {
          return marker;
        }
      }
      return null;
    } else {
      let distance = 999999999999.0;
      this.pedestrianMarkers.forEach((marker) => {
        let markerDistance = marker.position.distanceTo(structurePosition);
        if (distance > markerDistance) {
          distance = markerDistance;
          closestMarker = marker;
        }
      });
    }
    return closestMarker;
  }

  GetClosestVehicleMarkerTo(structurePosition) {
    let closestMarker = null;

    let distance = 999999999999.0;
    this.carMarkers.forEach((marker) => {
      let markerDistance = marker.position.distanceTo(structurePosition);
      if (distance > markerDistance) {
        distance = markerDistance;
        closestMarker = marker;
      }
    });
    return closestMarker;
  }

  GetClosestPedestrianPosition(currentPosition) {
    return this.GetClosestMarkerTo(currentPosition).position;
  }

  GetAllMarkers() {
    return this.pedestrianMarkers;
  }

  RadiansToDegrees(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
  }

  GetDirection(direction) {
    if (direction[0] === -1) {
      return 'left';
    } else if (direction[0] === 1) {
      return 'right';
    } else if (direction[1] === -1) {
      return 'up';
    } else {
      return 'down';
    }
  }

  GetCorrectMarker(angle, directionArray, buildingDirectionArray, startOrEnd) {
    let direction = this.GetDirection(directionArray);
    let buildingDirection = this.GetDirection(buildingDirectionArray);
    let markersClone = [...this.carMarkers];
    if (startOrEnd === 'start') {
      if (angle === 0) {
        if (direction === 'left' && buildingDirection === 'up') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        } else if (direction === 'right' && buildingDirection === 'up') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        }
        if (direction === 'left' && buildingDirection === 'down') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        } else if (direction === 'right' && buildingDirection === 'down') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        }
      } else if (angle === 90) {
        if (direction === 'up' && buildingDirection === 'left') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        } else if (direction === 'down' && buildingDirection === 'left') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        } else if (direction === 'up' && buildingDirection === 'right') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        } else if (direction === 'down' && buildingDirection === 'right') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        }
      }
    } else {
      if (angle === 0) {
        if (direction === 'left' && buildingDirection === 'up') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        } else if (direction === 'right' && buildingDirection === 'up') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        }
        if (direction === 'left' && buildingDirection === 'down') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        } else if (direction === 'right' && buildingDirection === 'down') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        }
      } else if (angle === 90) {
        if (direction === 'up' && buildingDirection === 'left') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        } else if (direction === 'down' && buildingDirection === 'left') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        } else if (direction === 'up' && buildingDirection === 'right') {
          return markersClone.filter((marker) => marker.leftMarker === true)[0].position;
        } else if (direction === 'down' && buildingDirection === 'right') {
          return markersClone.filter((marker) => marker.rightMarker === true)[0].position;
        }
      }
    }
  }

  GetPositionForCarToSpawn(nextPathPosition, startBuilding) {
    if (this.buildingModel === 'roadStraight') {
      let angle = this.RadiansToDegrees(this.rotationY);
      if (angle === 360) {
        angle = 0;
      }
      let direction = [
        nextPathPosition[0] - this.client.position[0],
        nextPathPosition[1] - this.client.position[1],
      ];
      let buildingDirection = [
        startBuilding.gridPos[0] - this.client.position[0],
        startBuilding.gridPos[1] - this.client.position[1],
      ];
      return this.GetCorrectMarker(angle, direction, buildingDirection, 'start');
    } else {
      let markersClone = [...this.carMarkers];
      return markersClone.filter((marker) => marker.upMarker === true)[0].position;
    }
  }

  GetPositionForCarToEnd(prevPathPosition, endBuilding) {
    if (this.buildingModel === 'roadStraight') {
      let angle = this.RadiansToDegrees(this.rotationY);
      if (angle === 360) {
        angle = 0;
      }
      let direction = [
        prevPathPosition[0] - this.client.position[0],
        prevPathPosition[1] - this.client.position[1],
      ];
      let buildingDirection = [
        endBuilding.gridPos[0] - this.client.position[0],
        endBuilding.gridPos[1] - this.client.position[1],
      ];
      return this.GetCorrectMarker(angle, direction, buildingDirection, 'end');
    } else {
      let markersClone = [...this.carMarkers];
      return markersClone.filter((marker) => marker.upMarker === false)[0].position;
    }
  }
}

export default Road;
