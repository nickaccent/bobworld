// import React, { useRef, useEffect, useLayoutEffect, useState, useMemo } from 'react';
// import { SkeletonUtils } from 'three-stdlib';
// import { useGLTF, useAnimations } from '@react-three/drei';
// import { useFrame, useGraph } from '@react-three/fiber';
// import * as THREE from 'three';
// import { useStore } from '../hooks/useStore';

// function Line({ start, end }) {
//   const ref = useRef();
//   useLayoutEffect(() => {
//     ref.current.geometry.setFromPoints([start, end].map((point) => new THREE.Vector3(...point)));
//   }, [start, end]);
//   return (
//     <line ref={ref}>
//       <bufferGeometry />
//       <lineBasicMaterial color="hotpink" linewidth="2.0" />
//     </line>
//   );
// }

// function Person({ entity }) {
//   const group = useRef();
//   const meshRef = useRef();
//   const { scene, materials, animations } = useGLTF('/Models/newModels/People/bob.glb');
//   const { actions } = useAnimations(animations, group);
//   const [lines, setLines] = useState([]);
//   const [debug] = useStore((state) => [state.debug]);

//   const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
//   const { nodes } = useGraph(clone);

//   const setTemplines = (entity) => {
//     let templines = [];
//     entity.graph.GetVertices().forEach((vertex) => {
//       let vertextObj = entity.graph.GetVertexByKey(vertex);
//       let cv = entity.graph.GetConnectedVerticesTo(vertex);

//       cv.forEach((vertexNeighbour) => {
//         const points = [];
//         points.push(
//           new THREE.Vector3(vertextObj.vertex.position.x, 0.25, vertextObj.vertex.position.z),
//         );
//         points.push(
//           new THREE.Vector3(
//             vertexNeighbour.vertex.position.x,
//             0.25,
//             vertexNeighbour.vertex.position.z,
//           ),
//         );
//         templines.push(points);
//       });
//     });
//     return templines;
//   };

//   useEffect(() => {
//     actions.Walk.timeScale = 1.75;
//     actions.Walk.play();
//     let templines = setTemplines(entity);
//     setLines(templines);
//   }, []);

//   useFrame((state, delta) => {
//     meshRef.current.position.x = entity.position.x;
//     meshRef.current.position.z = entity.position.z;
//     meshRef.current.position.y = entity.position.y;
//     meshRef.current.quaternion.setFromRotationMatrix(entity.direction);
//     if (entity.updateGraph === true) {
//       let templines = setTemplines(entity);
//       setLines(templines);
//       entity.updateGraph = false;
//     }
//   });

//   return (
//     <>
//       <mesh ref={meshRef} castShadow position={[entity.position.x, 0.025, entity.position.z]}>
//         <group ref={group} dispose={null} scale={(0.05, 0.05, 0.05)}>
//           <group name="Scene">
//             <group name="ArmatureHair" position={[-0.02, 1, -0.15]} rotation={[0, 0, 0]}>
//               <primitive object={nodes.Pelvis} />
//               <primitive object={nodes.IKTargetL} />
//               <primitive object={nodes.IKPoleL} />
//               <primitive object={nodes.IKTargetR} />
//               <primitive object={nodes.IKPoleR} />
//               <skinnedMesh
//                 name="Hair"
//                 geometry={nodes.Hair.geometry}
//                 material={materials['material1']}
//                 skeleton={nodes.Hair.skeleton}
//                 castShadow
//               />
//             </group>
//           </group>
//         </group>
//       </mesh>

//       {debug &&
//         lines.map((line, index) => {
//           return (
//             <Line
//               start={[line[0].x, line[0].y, line[0].z]}
//               end={[line[1].x, line[1].y, line[1].z]}
//               key={index}
//             />
//           );
//         })}
//     </>
//   );
// }

// function PeopleInstances({ peopleEntities }) {
//   return (
//     <>
//       {peopleEntities.length > 0 ? (
//         <>
//           {peopleEntities.map((entity, i) => {
//             return <Person key={i} entity={entity} />;
//           })}
//         </>
//       ) : (
//         ''
//       )}
//     </>
//   );
// }

// const People = ({ people }) => {
//   return <>{people.length > 0 ? <PeopleInstances peopleEntities={people} /> : ''}</>;
// };

// export default People;

// useGLTF.preload('/Models/newModels/People/bobsimple.glb');

import React, { useRef, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, useGLTF } from '@react-three/drei';
import { GUIContext } from '../contexts/GUI';

function PeopleInstances({ peopleEntities }) {
  const { nodes, materials } = useGLTF('/Models/newModels/People/bobsimple.glb');
  return (
    <>
      {peopleEntities.length > 0 ? (
        <>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob.geometry}
            material={materials.Hair}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob_1.geometry}
            material={materials.Skin}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob_2.geometry}
            material={materials.Black}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob_3.geometry}
            material={materials.DarkRed}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob_4.geometry}
            material={materials.Red}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
              })}
            </group>
          </Instances>
          <Instances
            range={peopleEntities.length}
            geometry={nodes.Bob_5.geometry}
            material={materials.Blue}
          >
            <group position={[0, 0, 0]}>
              {peopleEntities.map((entity, i) => {
                return <Person key={i} {...entity} />;
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

function Person({ ...props }) {
  const { setSelectedItem } = useContext(GUIContext);
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x = props.position.x;
    ref.current.position.y = 0.025;
    ref.current.position.z = props.position.z;
    ref.current.rotation.y = props.rotationY;
    ref.current.quaternion.setFromRotationMatrix(props.direction);
    ref.current.visible = true;
  }, []);

  const onPointerUp = (e) => {
    e.stopPropagation();
    setSelectedItem(props);
  };

  return <Instance ref={ref} onPointerUp={(e) => onPointerUp(e)} />;
}

const People = ({ people }) => {
  return <>{people.length > 0 ? <PeopleInstances peopleEntities={people} /> : ''}</>;
};

export default People;
