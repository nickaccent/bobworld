import * as THREE from 'three';
import Entity from './Entity';

const commercialModels = ['shop1'];

const officeNouns = [
  'Commerce',
  'Trade',
  'Business',
  'Enterprises',
  'Solutions',
  'Services',
  'Group',
  'Corp',
  'Company',
  'Inc',
  'Ventures',
  'Agency',
  'Partners',
  'Consulting',
  'Industries',
  'Operations',
  'Management',
  'Holdings',
  'Systems',
  'Logistics',
  'Retail',
  'Wholesale',
  'Manufacturing',
  'Distribution',
  'Marketing',
  'Investments',
  'Banking',
  'Finance',
  'Technology',
  'Software',
  'Analytics',
  'Digital',
  'E-commerce',
  'Mall',
  'Marketplace',
  'Transactions',
  'Contracts',
  'Projects',
  'Development',
  'Innovation',
  'Supply Chain',
  'Shipping',
  'Warehousing',
  'Purchasing',
  'Sales',
  'Advertising',
  'Consultancy',
  'Services',
  'Merchandising',
  'Trading',
  'Franchise',
  'Operations',
  'Management',
  'Customer Service',
  'Consumer Goods',
  'Retailers',
  'Brokers',
  'Exporters',
  'Importers',
  'Startups',
  'Entrepreneurs',
  'Branding',
  'Real Estate',
  'Investments',
  'Insurance',
  'Legal',
  'Accounting',
  'Auditing',
  'Payment',
  'Processing',
  'Credit',
  'Loans',
  'Financing',
  'Wealth Management',
  'Asset Management',
  'Investment Banking',
  'Mergers',
  'Acquisitions',
  'Stocks',
  'Equities',
  'Commodities',
  'Futures',
  'Options',
  'Risk Management',
  'Financial Planning',
  'Cryptocurrency',
  'Blockchain',
  'Cloud Computing',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Cybersecurity',
  'Web Development',
  'Mobile Apps',
  'Software Development',
  'IT Services',
  'Networks',
  'Telecommunications',
  'Internet of Things',
  'Digital Marketing',
  'Social Media',
  'Content Creation',
  'Graphic Design',
  'Market Research',
  'Consulting',
  'Strategy',
  'Business Intelligence',
  'Project Management',
  'Product Development',
  'Quality Control',
  'Operations',
  'Supply Chain',
  // Add more nouns here...
];

const officeAdjectives = [
  'Global',
  'International',
  'National',
  'Local',
  'Leading',
  'Premier',
  'Elite',
  'Innovative',
  'Dynamic',
  'Progressive',
  'Trusted',
  'Reliable',
  'Proven',
  'Professional',
  'Smart',
  'Strategic',
  'Creative',
  'Forward-thinking',
  'Cutting-edge',
  'Sustainable',
  'High-performance',
  'Customer-focused',
  'Result-oriented',
  'Agile',
  'Flexible',
  'Efficient',
  'Modern',
  'Integrated',
  'Digital',
  'Connected',
  'Influential',
  'Visionary',
  'Expert',
  'Collaborative',
  'Pioneering',
  'Revolutionary',
  'Impactful',
  'Empowering',
  'Adaptive',
  'Inventive',
  'Empirical',
  'Data-driven',
  'Responsive',
  'Disruptive',
  'Inclusive',
  'Progressive',
  'Transformational',
  'Evolving',
  'Dynamic',
  'Adaptable',
  'Cutting-edge',
  'Revolutionary',
  'Proactive',
  'Efficient',
  'Innovative',
  'Agile',
  'Strategic',
  'Collaborative',
  'Digital',
  'Modern',
  'Tech-driven',
  'Data-focused',
  'User-centric',
  'Customer-centric',
  'Solution-oriented',
  'Result-driven',
  'Smart',
  'Advanced',
  'Next-gen',
  'Sustainable',
  'Eco-friendly',
  'Green',
  'High-performance',
  'Optimized',
  'Flexible',
  'Seamless',
  'Integrated',
  'Inclusive',
  'Empowering',
  'Customer-oriented',
  'Streamlined',
  'Robust',
  'Scalable',
  'Secure',
  'Progressive',
  'Cutting-edge',
  'Disruptive',
  'Transformative',
  'Innovative',
  'Holistic',
  'Informed',
  'Adaptive',
  'Intelligent',
  'Strategic',
  'Collaborative',
  'Creative',
  'Dynamic',
  'Versatile',
  'Resilient',
  'Experienced',
  'Trusted',
  'Reliable',
  'Professional',
  'Expert',
  'Knowledgeable',
  'Specialized',
  'Certified',
  'Accredited',
  'Efficient',
  // Add more adjectives here...
];

const shopTypes = [
  'Boutique',
  'Store',
  'Shop',
  'Market',
  'Outlet',
  'Gallery',
  'Mall',
  'Emporium',
  'Depot',
  'Mart',
  'Shoppe',
  'Supermarket',
  'Corner Store',
  'Bazaar',
  'Shoplet',
  'Traders',
  'Shoppers',
  'Haven',
  'Exchange',
  'Mercantile',
  'Workshop',
  'Stall',
  'Stand',
  'Storefront',
  'Co-op',
  'Showroom',
  'Warehouse',
  'Kiosk',
  'Vendor',
  'Pop-up',
];

const shopAdjectives = [
  'Charming',
  'Cozy',
  'Quaint',
  'Trendy',
  'Stylish',
  'Unique',
  'Vintage',
  'Modern',
  'Elegant',
  'Hip',
  'Eclectic',
  'Artisan',
  'Delightful',
  'Enchanting',
  'Upscale',
  'Funky',
  'Fancy',
  'Sleek',
  'Gourmet',
  'Wholesome',
  'Chic',
  'Rustic',
  'Lively',
  'Glamorous',
  'Colorful',
  'Whimsical',
  'Sustainable',
  'Ethical',
  'Organic',
  'Curated',
];

const shopNouns = [
  'Delights',
  'Treasures',
  'Goods',
  'Wares',
  'Findings',
  'Essentials',
  'Collectibles',
  'Curiosities',
  'Art',
  'Crafts',
  'Boutique',
  'Fashion',
  'Jewelry',
  'Furniture',
  'Books',
  'Toys',
  'Accessories',
  'Appliances',
  'Bakery',
  'Cafe',
  'Gallery',
  'Gifts',
  'Home',
  'Decor',
  'Market',
  'Outfitters',
  'Studio',
  'Workshop',
  'Flowers',
  'Shoes',
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
    needs: {},
  },
  {
    key: 'level1',
    taxable: true,
    workers_min: 1,
    workers_max: 2,
    funds_low: 1000.0,
    funds_high: 5000.0,
    average_spend: 180.0,
    wage: 275.0,
    type: ['corner_shop'],
    shift_startH: 16,
    shift_startM: 0,
    shift_endH: 22,
    shift_endM: 30,
    needs: { power: false, water: false },
  },
  {
    key: 'level2',
    taxable: true,
    workers_min: 5,
    workers_max: 30,
    funds_low: 5000.0,
    funds_high: 40000.0,
    wage: 375.0,
    average_spend: 380.0,
    type: ['supermarket'],
    shift_startH: 7,
    shift_startM: 0,
    shift_endH: 18,
    shift_endM: 30,
    needs: { power: false, water: false, medical: false },
  },
];

class Commercial extends Entity {
  constructor(params) {
    super(params);
    this.buildingLevel = 0;
    if (params.hasOwnProperty('buildingLevel')) {
      this.buildingLevel = params.buildingLevel;
      this.levelData = levels.filter((level) => level.key === `level${this.buildingLevel}`)[0];
      this.needs = this.levelData.needs;
    } else {
      this.buildingLevel = 0;
      this.levelData = levels.filter((level) => level.key === 'level0')[0];
      this.needs = this.levelData.needs;
    }
    this.parent.commercial.push(this);
    this.platformPositionModifier = [0, 0, 0];
    this.maxEmployees = this.levelData.workers_max;
    this.employees = [];
    this.stock = 0;
    this.platformSize = 1;
    this.current_funds = 0;
    this.name = this.GenerateShopName();
  }

  LevelUp() {
    this.buildingLevel += 1;
    // console.log('commercial level up to ' + this.buildingLevel);
    if (this.buildingLevel === 1) {
      this.buildingModel = this.GetCommercialModel();
      this.SetCommercialParams();
      this.parent.buildings.push(this);
      this.CommercialFix();
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
    const randomAdjective = officeAdjectives[Math.floor(Math.random() * officeAdjectives.length)];
    const randomNoun = officeNouns[Math.floor(Math.random() * officeNouns.length)];

    return randomAdjective + ' ' + randomNoun;
  }

  GenerateShopName() {
    const randomType = shopTypes[Math.floor(Math.random() * shopTypes.length)];
    const randomAdjective = shopAdjectives[Math.floor(Math.random() * shopAdjectives.length)];
    const randomNoun = shopNouns[Math.floor(Math.random() * shopNouns.length)];

    return randomAdjective + ' ' + randomType + ' of ' + randomNoun;
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

  CommercialFix() {
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
      this.position.x += 0.04;
      this.rotationY = (Math.PI / 2) * 3;
    } else if (
      connections.up === false &&
      connections.down === false &&
      connections.left === false &&
      connections.right === true
    ) {
      this.position.x -= 0.04;
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

  GetCommercialModel() {
    return commercialModels[this.RandomIntFromInterval(0, commercialModels.length - 1)];
  }

  SetCommercialParams() {
    if (this.buildingModel === 'shop1') {
      this.scale = [0.005, 0.005, 0.005];
      this.positionModifier = [0, 0, 0];
      this.platformPositionModifier = [0, 0, 0];
    }
  }

  Update(delta, clockH, clockM) {
    if (this.buildingLevel === 0) {
      // let randomSeed = Math.floor(Math.random() * 10) + 1;
      // // let randomSeed = Math.floor(Math.random() * 10000) + 1;
      // if (randomSeed === 1) {
      this.LevelUp();
      this.parent.requiresUpdate = true;
      // }
    }
  }
}

export default Commercial;
