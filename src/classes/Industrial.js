import * as THREE from 'three';
import uuid from 'react-uuid';
import Entity from './Entity';
import Vehicle from './Vehicle';

const industrialModels = ['factory1'];

const adjectives = [
  'Advanced',
  'Industrial',
  'Global',
  'Innovative',
  'Modern',
  'Techno',
  'Precision',
  'Dynamic',
  'Optimal',
  'Power',
  'Alpha',
  'Omega',
  'Superior',
  'Efficient',
  'Reliable',
  'Proactive',
  'Prime',
  'NexGen',
  'Elite',
  'Pinnacle',
  'Cutting-edge',
  'Revolutionary',
  'Smart',
  'High-tech',
  'Sustainable',
  'State-of-the-art',
  'Creative',
  'Agile',
  'Strategic',
  'Flexible',
  'Forward-thinking',
  'Progressive',
  'Resilient',
  'Digital',
  'Ingenious',
  'Responsive',
  'Adaptive',
  'Inventive',
  'Robust',
  'Streamlined',
  'Efficient',
  'Optimized',
  'Versatile',
  'Innovative',
  'Empowering',
  'Transformative',
  'Disruptive',
  'Advanced',
  'Efficient',
  'Dynamic',
  'Integrated',
  'Global',
  'Smart',
  'Proactive',
  'Secure',
  'Collaborative',
  'Data-driven',
  'Automated',
  'Intelligent',
  'Cloud-based',
  'Scalable',
  'Customizable',
  'User-centric',
  'Cutting-edge',
  'Modern',
  'Reliable',
  'Agile',
  'Flexible',
  'Optimal',
  'Seamless',
  'Optimized',
  'Next-generation',
  'Connected',
  'Responsive',
  'Intuitive',
  'Strategic',
  'Streamlined',
  'Robust',
  'Creative',
  'Inventive',
  'Revolutionary',
  'Innovative',
  'Sustainable',
  'Eco-friendly',
  'Green',
  'High-performance',
  'Efficient',
  'Precision',
  'Quality',
  'Leading',
  'Top-tier',
  'Highly skilled',
  'Expert',
  'Trusted',
  'Experienced',
  'Specialized',
  'Professional',
  'Reliable',
  'Certified',
  'Accredited',
];

const nouns = [
  'Tech',
  'Dynamics',
  'Electronics',
  'Devices',
  'Techtronics',
  'Solutions',
  'Supplies',
  'Materials',
  'Manufacturers',
  'Tools',
  'Automation',
  'Engineering',
  'Components',
  'Instruments',
  'Systems',
  'Machinery',
  'Operations',
  'Industries',
  'Enterprises',
  'Products',
  'Logistics',
  'Manufacturing',
  'Construction',
  'Fabrication',
  'Innovation',
  'Engineering',
  'Development',
  'Design',
  'Assembly',
  'Metals',
  'Plastics',
  'Chemicals',
  'Electrical',
  'Robotics',
  'Software',
  'Hardware',
  'Heavy Industries',
  'Utilities',
  'Solutions',
  'Consulting',
  'Energy',
  'Power',
  'Processing',
  'Packaging',
  'Distribution',
  'Suppliers',
  'Research',
  'Quality Control',
  'Mining',
  'Printing',
  'Aviation',
  'Aerospace',
  'Defense',
  'Navigation',
  'Maintenance',
  'Repair',
  'Renewable Energy',
  'Environmental',
  'Safety',
  'Waste Management',
  'Shipping',
  'Transportation',
  'Railways',
  'Automotive',
  'Fabrication',
  'Textiles',
  'Pulp',
  'Paper',
  'Chemical',
  'Pharmaceutical',
  'Healthcare',
  'Medical',
  'Biochemical',
  'Nutrition',
  'Biotechnology',
  'Agriculture',
  'Food Processing',
  'Beverages',
  'Packaging',
  'Furniture',
  'Plumbing',
  'Carpentry',
  'Construction',
  'Infrastructure',
  'Building',
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Instrumentation',
];

const levels = [
  {
    key: 'level0',
    taxable: false,
    workers_min: 0,
    workers_max: 0,
    funds_low: 0.0,
    funds_high: 0.0,
    type: ['zone'],
    shift_startH: 0,
    shift_startM: 0,
    shift_endH: 0,
    shift_endM: 0,
    needs: {},
  },
  {
    key: 'level1',
    taxable: true,
    workers_min: 1,
    workers_max: 20,
    funds_low: 1000.0,
    funds_high: 5000.0,
    wage: 300.0,
    type: ['small_factory'],
    shift_startH: 7,
    shift_startM: 30,
    shift_endH: 17,
    shift_endM: 0,
    needs: { power: false, water: false },
  },
  {
    key: 'level2',
    taxable: true,
    workers_min: 20,
    workers_max: 50,
    funds_low: 5000.0,
    funds_high: 40000.0,
    wage: 400.0,
    type: ['big_factory'],
    shift_startH: 7,
    shift_startM: 15,
    shift_endH: 17,
    shift_endM: 30,
    needs: { power: false, water: false, medical: false },
  },
];

class Industrial extends Entity {
  constructor(params) {
    super(params);
    this.buildingLevel = 0;
    this.current_funds = 0.0;
    if (params.hasOwnProperty('buildingLevel')) {
      this.buildingLevel = params.buildingLevel;
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
      this.needs = this.levelData.needs;
    } else {
      this.buildingLevel = 0;
      this.levelData = levels.filter((level) => level.key === 'level0')[0];
      this.needs = this.levelData.needs;
    }
    this.parent.industrial.push(this);
    this.platformPositionModifier = [0, 0, 0];
    this.maxEmployees = this.levelData.workers_max;
    this.employees = [];
    this.goods = 200;
    this.deliveryBatches = [];
    this.platformSize = 1;
    this.name = this.GenerateCompanyName();
  }

  LevelUp() {
    this.buildingLevel += 1;
    if (this.buildingLevel === 1) {
      this.buildingModel = this.GetIndustrialModel();
      this.SetIndustrialParams();
      this.parent.buildings.push(this);
      this.IndustrialFix();
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
      let funds =
        Math.random() * (this.levelData.funds_high - this.levelData.funds_low) +
        this.levelData.funds_low;
      this.current_funds = funds.toFixed(2);
      this.maxEmployees = this.levelData.workers_max;
      this.employees = [];
    }
    this.parent.soundManager.playSound('fx_levelup', false);
  }

  GenerateCompanyName() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return randomAdjective + ' ' + randomNoun;
  }

  JobsAvailable() {
    return this.maxEmployees - this.employees.length;
  }

  JobsFilled() {
    return this.employees.length;
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

  IndustrialFix() {
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

  GetIndustrialModel() {
    return industrialModels[this.RandomIntFromInterval(0, industrialModels.length - 1)];
  }

  SetIndustrialParams() {
    if (this.buildingModel === 'factory1') {
      this.scale = [0.005, 0.005, 0.005];
      this.positionModifier = [0, 0, 0];
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
    // if (clockH === this.levelData.shift_endH && Math.floor(clockM) === this.levelData.shift_endM) {
    //   let employeesGoods = this.employees.length * 10;
    //   this.goods = this.goods + employeesGoods;
    // }
    // if (
    //   clockH === this.levelData.shift_startH &&
    //   Math.floor(clockM) === this.levelData.shift_startM
    // ) {
    //   if (this.deliveryBatches.length === 0) {
    //     if (this.parent.commercial.length > 0) {
    //       let end = this.levelData.shift_endH;
    //       let start = this.levelData.shift_startH + 2;
    //       let difference = end - start;
    //       let goodsPerVan = 40;
    //       let batches = this.goods / goodsPerVan;
    //       let hoursPerVan = difference / batches;
    //       this.deliveryBatches = [];
    //       for (let i = 1; i <= batches; i++) {
    //         let goodsToPack = this.goods > goodsPerVan ? goodsPerVan : this.goods;
    //         let slot = i * hoursPerVan;
    //         let slotH = parseInt(this.levelData.shift_startH) + parseInt(slot);
    //         let destination =
    //           this.parent.commercial[
    //             this.RandomIntFromInterval(0, this.parent.commercial.length - 1)
    //           ];
    //         let destinationId = destination.id;
    //         this.deliveryBatches.push({
    //           uuid: uuid(),
    //           goodsCount: goodsToPack,
    //           deliverySlotH: parseInt(slotH),
    //           deliverySlotM: parseInt(this.levelData.shift_startM),
    //           destinationId: destinationId,
    //           startPoint: this,
    //         });
    //         this.goods -= goodsToPack;
    //       }
    //     }
    //   }
    // }
    // if (clockH >= this.levelData.shift_startH + 1) {
    //   if (clockH <= this.levelData.shift_endH + 1) {
    //     if (this.deliveryBatches.length > 0) {
    //       let deliveryOptions = this.deliveryBatches.filter(
    //         (batch) => batch.deliverySlotH === clockH && batch.deliverySlotM === Math.floor(clockM),
    //       );
    //       if (deliveryOptions.length > 0) {
    //         for (let i = 0; i < deliveryOptions.length; i++) {
    //           let deliveryBatch = deliveryOptions[i];
    //           const vehicle = new Vehicle({
    //             grid: this.parent.hashGrid,
    //             x: 0.0,
    //             y: 0.5,
    //             z: 0.0,
    //             type: 'vehicle',
    //             w: this.parent.w,
    //             d: this.parent.d,
    //             parent: this.parent,
    //             spawnBuilding: this.id,
    //             targetBuilding: deliveryBatch.destinationId,
    //             cargo: deliveryBatch.goodsCount,
    //             cargoCost: 60,
    //             batchId: deliveryBatch.uuid,
    //             vehicleModel: 'truck',
    //             destinations: [deliveryBatch.destinationId, this.id],
    //           });
    //           this.parent.addEntity(vehicle);
    //           this.deliveryBatches = this.deliveryBatches.filter(
    //             (batch) => batch.uuid != deliveryBatch.uuid,
    //           );
    //         }
    //       }
    //     }
    //   }
    // }
  }
}

export default Industrial;
