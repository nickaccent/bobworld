import Entity from './Entity';

const available_tiles = [
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

const levels = [
  {
    key: 'level1',
    taxable: false,
    cost: 10,
    upFrontCost: 20,
    range: 4,
  },
  {
    key: 'level2',
    taxable: false,
    cost: 20,
    upFrontCost: 40,
    range: 6,
  },
  {
    key: 'level3',
    taxable: false,
    cost: 40,
    upFrontCost: 60,
    range: 8,
  },
];

class Utility extends Entity {
  constructor(params) {
    super(params);
    this.buildingLevel = 1;
    this.utilityType = params.utilityType;
    this.buildingModel = this.GetUtilitylModel();
    if (params.hasOwnProperty('buildingLevel')) {
      this.buildingLevel = params.buildingLevel;
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
    } else {
      this.buildingLevel = 1;
      this.levelData = levels.filter((level) => level.key === 'level1')[0];
    }
    this.parent.utilities.push(this);
    this.platformPositionModifier = [0.05, 0, -0.05];
    this.position.x = this.position.x + 0.45;
    this.position.z = this.position.z + 0.55;
    this.platformSize = 2;
    this.radarTiles = [];
    this.GetRadarTiles(this.gridPos);
    this.UtilityFix();
  }

  LevelUp() {
    this.buildingLevel += 1;
    if (this.buildingLevel === 1) {
      this.buildingModel = this.GetUtilitylModel();
      this.parent.buildings.push(this);
      this.UtilityFix();
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
    }
    this.parent.soundManager.playSound('fx_levelup', false);
  }

  GetNearestRoad() {
    let roadDirection = 'down';
    const connections = this.GetConnected();
    if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      roadDirection = 'down';
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      roadDirection = 'down';
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      roadDirection = 'up';
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      roadDirection = 'left';
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      roadDirection = 'right';
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      roadDirection = 'up';
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      roadDirection = 'up';
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === true &&
      connections.right === false
    ) {
      roadDirection = 'down';
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === true
    ) {
      roadDirection = 'down';
    }
    let roadPointX = this.gridPos[0];
    let roadPointY = this.gridPos[1];
    if (roadDirection === 'left') {
      roadPointX -= 1;
    } else if (roadDirection === 'right') {
      roadPointX += 1;
    } else if (roadDirection === 'up') {
      roadPointY -= 1;
    } else if (roadDirection === 'down') {
      roadPointY += 1;
    }
    const roadPointGridKey = this.grid.Key(roadPointX, roadPointY);
    const roadPointGridCell = this.grid.GetCellByKey(roadPointGridKey);
    return roadPointGridCell.set.filter((client) => client.type === 'road')[0];
  }

  UtilityFix() {
    let connections = this.GetConnected();
    if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 4;
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 4;
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 2;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 3;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      this.rotationY = (Math.PI / 2) * 1;
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === true &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 2;
    } else if (
      connections.up === true &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      this.rotationY = (Math.PI / 2) * 2;
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === true &&
      connections.right === false
    ) {
      this.rotationY = (Math.PI / 2) * 4;
    } else if (
      connections.up === false &&
      connections.down === true &&
      connections.left === false &&
      connections.right === true
    ) {
      this.rotationY = (Math.PI / 2) * 4;
    }
    let road = this.GetNearestRoad();
    if (road.position[0] > this.gridPos[0]) {
      // road is to the right
      this.position.x = this.position.x - 1;
      let left = [this.gridPos[0] - 1, this.gridPos[1]];
      let bottomLeft = [this.gridPos[0] - 1, this.gridPos[1] + 1];
      let bottomRight = [this.gridPos[0], this.gridPos[1] + 1];
      this.grid.NewClient(left, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomLeft, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomRight, [1, 1], this.IsWalkable(), this.id, this.type);
    } else if (road.position[0] < this.gridPos[0]) {
      // road is to the left
      let right = [this.gridPos[0] + 1, this.gridPos[1]];
      let bottomRight = [this.gridPos[0] + 1, this.gridPos[1] + 1];
      let bottomLeft = [this.gridPos[0], this.gridPos[1] + 1];
      this.grid.NewClient(right, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomRight, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomLeft, [1, 1], this.IsWalkable(), this.id, this.type);
    } else if (road.position[1] > this.gridPos[1]) {
      // road below
      // minus to z position
      let top = [this.gridPos[0], this.gridPos[1] - 1];
      let topRight = [this.gridPos[0] + 1, this.gridPos[1] - 1];
      let bottomRight = [this.gridPos[0] + 1, this.gridPos[1]];
      this.grid.NewClient(top, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(topRight, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomRight, [1, 1], this.IsWalkable(), this.id, this.type);
      this.position.z = this.position.z - 1;
    } else if (road.position[1] < this.gridPos[1]) {
      // road above
      // do nothing position
      let bottom = [this.gridPos[0], this.gridPos[1] + 1];
      let topRight = [this.gridPos[0] + 1, this.gridPos[1]];
      let bottomRight = [this.gridPos[0] + 1, this.gridPos[1] + 1];
      this.grid.NewClient(bottom, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(topRight, [1, 1], this.IsWalkable(), this.id, this.type);
      this.grid.NewClient(bottomRight, [1, 1], this.IsWalkable(), this.id, this.type);
    }
  }

  GetUtilitylModel() {
    if (this.utilityType === 'power_station') {
      return 'power_station';
    } else if (this.utilityType === 'water_plant') {
      return 'water_plant';
    }
  }

  GetRadarTiles(gridPos) {
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
    if (gridPos[0] + 4 <= this.parent.w) {
      rightMargin = 4;
    } else if (gridPos[0] + 3 <= this.parent.w) {
      rightMargin = 3;
    } else if (gridPos[0] + 2 <= this.parent.w) {
      rightMargin = 2;
    } else if (gridPos[0] + 1 <= this.parent.w) {
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
    if (gridPos[1] + 4 <= this.parent.d) {
      bottomMargin = 4;
    } else if (gridPos[1] + 3 <= this.parent.d) {
      bottomMargin = 3;
    } else if (gridPos[1] + 2 <= this.parent.d) {
      bottomMargin = 2;
    } else if (gridPos[1] + 1 <= this.parent.d) {
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
          xVal = xVal - Math.floor(this.parent.w / 2);
          let zVal = gridPos[1] + y;
          zVal = zVal - Math.floor(this.parent.d / 2);
          gridCellArray.push({ key: actualK, x: xVal, z: zVal });
        }
      }
    }
    this.radarTiles = gridCellArray;
  }
}

export default Utility;
