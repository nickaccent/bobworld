import Entity from './Entity';

const houseModelsLevel1 = ['houseSmall'];
const houseModelsLevel2 = ['house1', 'house2', 'house3'];

const levels = [
  {
    key: 'level0',
    taxable: false,
    workers_min: 0,
    workers_max: 0,
    funds_low_pp: 0.0,
    funds_high_pp: 0.0,
    tenants: [],
    type: ['zone'],
    needs: {},
  },
  {
    key: 'level1',
    taxable: true,
    people_min: 1,
    people_max: 4,
    funds_low_pp: 1000.0,
    funds_high_pp: 2000.0,
    tenants: [],
    type: ['small_house'],
    needs: { power: false, water: false },
  },
  {
    key: 'level2',
    taxable: true,
    people_min: 2,
    people_max: 6,
    funds_low_pp: 1000.0,
    funds_high_pp: 2000.0,
    tenants: [],
    needs: { power: false, water: false, medical: false },
  },
  {
    key: 'level3',
    taxable: true,
    people_min: 8,
    people_max: 12,
    funds_low_pp: 1000.0,
    funds_high_pp: 2000.0,
    tenants: [],
  },
  {
    key: 'level3',
    taxable: true,
    people_min: 10,
    people_max: 22,
    funds_low_pp: 1000.0,
    funds_high_pp: 2000.0,
    tenants: [],
    type: ['large_apartment'],
    needs: { power: false, water: false, medical: false, police: false, school: false },
  },
];

class Residential extends Entity {
  constructor(params) {
    super(params);
    this.needs = {};
    if (params.hasOwnProperty('buildingLevel')) {
      this.buildingLevel = params.buildingLevel;
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
      this.needs = this.levelData.needs;
    } else {
      this.buildingLevel = 0;
      this.levelData = levels.filter((level) => level.key === 'level0')[0];
      this.needs = this.levelData.needs;
    }
    this.parent.residential.push(this);
    this.platformPositionModifier = [0, 0, 0];
    this.tenants = [];
    this.buildingModel = null;
    this.platformSize = 1;
  }

  LevelUp() {
    this.buildingLevel += 1;
    // console.log('residential level up to ' + this.buildingLevel);
    if (this.buildingLevel === 1) {
      this.buildingModel = this.GetHouseModel();
      this.SetHouseParams();
      this.parent.buildings.push(this);
      this.HouseFix();
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
      let total =
        Math.random() * (this.levelData.people_max - this.levelData.people_min) +
        this.levelData.people_min;
      for (let i = 0; i < Math.floor(total); i++) {
        let personFunds =
          Math.random() * (this.levelData.funds_high_pp - this.levelData.funds_low_pp) +
          this.levelData.funds_low_pp;
        let person = this.parent.SpawnPersonInBuilding(this.id, personFunds.toFixed(2));
        this.tenants.push(person.id);
      }
    }
    this.parent.soundManager.playSound('fx_levelup', false);
  }

  SetLevel(level) {
    this.buildingLevel = level;
    this.SetHouseParams();
    this.parent.buildings.push(this);
    this.HouseFix();
    this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
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

  HouseFix() {
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
  }

  GetHouseModel() {
    if (this.buildingLevel === 1) {
      return houseModelsLevel1[this.RandomIntFromInterval(0, houseModelsLevel1.length - 1)];
    } else if (this.buildingLevel === 2) {
      return houseModelsLevel2[this.RandomIntFromInterval(0, houseModelsLevel2.length - 1)];
    }
  }

  SetHouseParams() {
    if (this.buildingModel === 'house1') {
      this.scale = [0.005, 0.005, 0.005];
      this.positionModifier = [0, -0.25, -0.0];
      this.platformPositionModifier = [0, 0, 0];
    } else if (this.buildingModel === 'house2') {
      this.scale = [0.005, 0.005, 0.005];
      this.positionModifier = [0, -0.25, 0];
      this.platformPositionModifier = [0, 0, 0];
    } else if (this.buildingModel === 'house3') {
      this.scale = [0.005, 0.005, 0.005];
      this.positionModifier = [0, -0.25, 0];
      this.platformPositionModifier = [0, 0, 0];
    }
  }

  Update(delta, clockH, clockM) {
    if (this.buildingLevel === 0) {
      // let randomSeed = Math.floor(Math.random() * 10000) + 1;
      // let randomSeed = Math.floor(Math.random() * 10) + 1;
      // if (randomSeed === 1) {
      this.LevelUp();
      this.parent.requiresUpdate = true;
      // }
    }
  }
}

export default Residential;
