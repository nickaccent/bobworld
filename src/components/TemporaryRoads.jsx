import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, useGLTF } from '@react-three/drei';

function EndRoads({ endRoads }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Roads/deadEnd.glb');
  return (
    <>
      {endRoads.length > 0 ? (
        <>
          <Instances
            range={endRoads.length}
            geometry={nodes.street.geometry}
            material={materials.Grey}
          >
            <group position={[0, -0.49, 0]}>
              {endRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={endRoads.length}
            geometry={nodes.street_1.geometry}
            material={materials.Black}
          >
            <group position={[0, -0.49, 0]}>
              {endRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={endRoads.length}
            geometry={nodes.street_2.geometry}
            material={materials.White}
          >
            <group position={[0, -0.49, 0]}>
              {endRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
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

function StraightRoads({ straightRoads }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Roads/straight.glb');
  return (
    <>
      {straightRoads.length > 0 ? (
        <>
          <Instances
            range={straightRoads.length}
            geometry={nodes.street_straight.geometry}
            material={materials.Grey1}
          >
            <group position={[0, -0.49, 0]}>
              {straightRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={straightRoads.length}
            geometry={nodes.street_straight_1.geometry}
            material={materials.Black1}
          >
            <group position={[0, -0.49, 0]}>
              {straightRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={straightRoads.length}
            geometry={nodes.street_straight_2.geometry}
            material={materials.White1}
          >
            <group position={[0, -0.49, 0]}>
              {straightRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
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

function CurveRoads({ curveRoads }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Roads/curve.glb');
  return (
    <>
      {curveRoads.length > 0 ? (
        <>
          <Instances
            range={curveRoads.length}
            geometry={nodes.street_curve.geometry}
            material={materials.Grey2}
          >
            <group position={[0, -0.49, 0]}>
              {curveRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={curveRoads.length}
            geometry={nodes.street_curve_1.geometry}
            material={materials.Black2}
          >
            <group position={[0, -0.49, 0]}>
              {curveRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={curveRoads.length}
            geometry={nodes.street_curve_2.geometry}
            material={materials.White2}
          >
            <group position={[0, -0.49, 0]}>
              {curveRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
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

function ThreeWayRoads({ threeWayRoads }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Roads/threeway.glb');
  return (
    <>
      {threeWayRoads.length > 0 ? (
        <>
          <Instances
            range={threeWayRoads.length}
            geometry={nodes.street_three.geometry}
            material={materials.Grey3}
          >
            <group position={[0, -0.49, 0]}>
              {threeWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={threeWayRoads.length}
            geometry={nodes.street_three_1.geometry}
            material={materials.Black3}
          >
            <group position={[0, -0.49, 0]}>
              {threeWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={threeWayRoads.length}
            geometry={nodes.street_three_2.geometry}
            material={materials.White3}
          >
            <group position={[0, -0.49, 0]}>
              {threeWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
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

function FourWayRoads({ fourWayRoads }) {
  const { nodes, materials } = useGLTF('/Models/newModels/Roads/fourway.glb');
  return (
    <>
      {fourWayRoads.length > 0 ? (
        <>
          <Instances
            range={fourWayRoads.length}
            geometry={nodes.street_four.geometry}
            material={materials.Grey4}
          >
            <group position={[0, -0.49, 0]}>
              {fourWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={fourWayRoads.length}
            geometry={nodes.street_four_1.geometry}
            material={materials.Black4}
          >
            <group position={[0, -0.49, 0]}>
              {fourWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={fourWayRoads.length}
            geometry={nodes.street_four_2.geometry}
            material={materials.White4}
          >
            <group position={[0, -0.49, 0]}>
              {fourWayRoads.map((entity, i) => {
                return <Road key={i} {...entity} />;
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

function Road({ ...props }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x = props.position.x;
    ref.current.position.y = 0.445;
    ref.current.position.z = props.position.z;
    ref.current.scale.x = 0.5;
    ref.current.scale.y = 0.5;
    ref.current.scale.z = 0.5;
    ref.current.rotation.y = props.rotationY;
  }, []);

  return <Instance ref={ref} />;
}

const TemporaryRoads = ({ temporaryRoads }) => {
  const [deadEndEntities, setDeadEndEntities] = useState([]);
  const [straightEntities, setStraightEntities] = useState([]);
  const [curveEntities, setCurveEntities] = useState([]);
  const [threeWayEntities, setThreeWayEntities] = useState([]);
  const [fourWayEntities, setFourWayEntities] = useState([]);

  useEffect(() => {
    if (temporaryRoads.length > 0) {
      let tempDeadEndEntities = temporaryRoads.filter(
        (entity) => entity.buildingModel === 'roadEnd',
      );
      setDeadEndEntities(tempDeadEndEntities);
      let tempStraightEntities = temporaryRoads.filter(
        (entity) => entity.buildingModel === 'roadStraight',
      );
      setStraightEntities(tempStraightEntities);
      let tempCurveEntities = temporaryRoads.filter(
        (entity) => entity.buildingModel === 'roadCurve',
      );
      setCurveEntities(tempCurveEntities);
      let tempThreeWayEntities = temporaryRoads.filter(
        (entity) => entity.buildingModel === 'roadThreeWay',
      );
      setThreeWayEntities(tempThreeWayEntities);
      let tempFourWayEntities = temporaryRoads.filter(
        (entity) => entity.buildingModel === 'roadFourWay',
      );
      setFourWayEntities(tempFourWayEntities);
    }
  }, [temporaryRoads]);
  return (
    <>
      {deadEndEntities.length > 0 ? <EndRoads endRoads={deadEndEntities} /> : ''}
      {straightEntities.length > 0 ? <StraightRoads straightRoads={straightEntities} /> : ''}
      {curveEntities.length > 0 ? <CurveRoads curveRoads={curveEntities} /> : ''}
      {threeWayEntities.length > 0 ? <ThreeWayRoads threeWayRoads={threeWayEntities} /> : ''}
      {fourWayEntities.length > 0 ? <FourWayRoads fourWayRoads={fourWayEntities} /> : ''}
    </>
  );
};

export default TemporaryRoads;
