import React, { useRef, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, useGLTF } from '@react-three/drei';
import { GUIContext } from '../contexts/GUI';

function SmallHouse1Buildings({ houseBuildings }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Buildings/Residential/house_small1.glb');
  return (
    <>
      {houseBuildings.length > 0 ? (
        <>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small.geometry}
            material={materials.RedFactory1}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_1.geometry}
            material={materials.GreyFactory1}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_2.geometry}
            material={materials.WindowsFactory1}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_3.geometry}
            material={materials.PipesFactory1}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_4.geometry}
            material={materials.DoorFactory1}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_5.geometry}
            material={materials.Trunk}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_6.geometry}
            material={materials.Leaves}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_7.geometry}
            material={materials.Walls}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
                return <Building key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={houseBuildings.length}
            geometry={nodes.house_small_8.geometry}
            material={materials.Grass}
          >
            <group position={[0, 0, 0]}>
              {houseBuildings.map((entity, i) => {
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
    ref.current.position.y = -0.048;
    ref.current.position.z = props.position.z;
    ref.current.scale.x = 0.68;
    ref.current.scale.y = 0.68;
    ref.current.scale.z = 0.68;
    // ref.current.rotation.z = (Math.PI / 2) * 2;
    ref.current.rotation.y = props.rotationY;
    ref.current.visible = true;
  }, []);

  const onPointerUp = (e) => {
    e.stopPropagation();
    setSelectedItem(props);
  };

  return <Instance ref={ref} onPointerUp={(e) => onPointerUp(e)} />;
}

const ResidentialBuildings = ({ buildings }) => {
  let smallHouse1Entities = buildings.filter((entity) => entity.buildingModel === 'houseSmall');
  return (
    <>
      {smallHouse1Entities.length > 0 ? (
        <SmallHouse1Buildings houseBuildings={smallHouse1Entities} />
      ) : (
        ''
      )}
    </>
  );
};

export default ResidentialBuildings;
