import React, { useState, useEffect, useRef, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, useGLTF } from '@react-three/drei';
import { GUIContext } from '../contexts/GUI';

function Shop1Buildings({ shopBuildings }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Buildings/Commercial/shop1.glb');
  return (
    <>
      {shopBuildings.length > 0 ? (
        <>
          <Instances
            range={shopBuildings.length}
            geometry={nodes.Shop.geometry}
            material={materials.shop1}
          >
            <group position={[0, 0, 0]}>
              {shopBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
        </>
      ) : (
        ''
      )}
    </>
  );
}

function Building({ ...props }) {
  const { setSelectedItem } = useContext(GUIContext);
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x = props.position.x;
    ref.current.position.y = -0.028;
    ref.current.position.z = props.position.z;
    ref.current.scale.x = 0.58;
    ref.current.scale.y = 0.55;
    ref.current.scale.z = 0.545;
    ref.current.rotation.y = props.rotationY;
    ref.current.visible = true;
  }, []);

  const onPointerUp = (e) => {
    e.stopPropagation();
    setSelectedItem(props);
  };

  return <Instance ref={ref} onPointerUp={(e) => onPointerUp(e)} />;
}

const CommercialBuildings = ({ buildings }) => {
  let shop1Entities = buildings.filter((entity) => entity.buildingModel === 'shop1');
  return <>{shop1Entities.length > 0 ? <Shop1Buildings shopBuildings={shop1Entities} /> : ''}</>;
};

export default CommercialBuildings;
