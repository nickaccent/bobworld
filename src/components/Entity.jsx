import React from 'react';
import Building from './Building';
import Truck from './Truck';
import Hatchback from './Hatchback';
import Car from './Car';

const Entity = ({ entity, temporary }) => {
  if (
    entity.type === 'residential' ||
    entity.type === 'commercial' ||
    entity.type === 'industrial' ||
    entity.type === 'power' ||
    entity.type === 'water'
  ) {
    return <Building entity={entity} temporary={temporary} />;
  } else if (entity.type === 'person' && entity.visible === true && entity.hasCar === true) {
    // return <Car entity={entity} temporary={temporary} />;
  } else if (entity.type === 'vehicle' && entity.visible === true) {
    if (entity.vehicleModel === 'truck') {
      return <Truck entity={entity} />;
    } else if (entity.vehicleModel === 'hatchback') {
      return <Hatchback entity={entity} />;
    } else {
      return <Car entity={entity} />;
    }
  }
};

export default Entity;
