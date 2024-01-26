import React, { useRef, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, useGLTF } from '@react-three/drei';
import { GUIContext } from '../contexts/GUI';

function FactoryBuildings({ factoryBuildings }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Buildings/Industrial/factory1.glb');
  return (
    <>
      {factoryBuildings.length > 0 ? (
        <>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1.geometry}
            material={materials.RedFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1_1.geometry}
            material={materials.GreyFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1_2.geometry}
            material={materials.WindowsFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1_3.geometry}
            material={materials.PipesFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1_4.geometry}
            material={materials.AirconFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={factoryBuildings.length}
            geometry={nodes.factory1_5.geometry}
            material={materials.DoorFactory1}
          >
            <group position={[0, 0, 0]}>
              {factoryBuildings.map((entity, i) => {
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
    ref.current.position.y = 0;
    ref.current.position.z = props.position.z;
    ref.current.rotation.y = props.rotationY;
    ref.current.visible = true;
  }, []);

  const onPointerUp = (e) => {
    e.stopPropagation();
    setSelectedItem(props);
  };

  return <Instance ref={ref} onPointerUp={(e) => onPointerUp(e)} />;
}

const IndustrialBuildings = ({ buildings }) => {
  let factory1Entities = buildings.filter((entity) => entity.buildingModel === 'factory1');
  return (
    <>
      {factory1Entities.length > 0 ? <FactoryBuildings factoryBuildings={factory1Entities} /> : ''}
    </>
  );
};

export default IndustrialBuildings;
