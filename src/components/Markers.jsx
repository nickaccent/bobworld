import React, { useLayoutEffect, useRef, useState } from 'react';

import * as THREE from 'three';

const tempOpenMarkers = new THREE.Object3D();
const tempClosedMarkers = new THREE.Object3D();
const tempCarUpMarkers = new THREE.Object3D();
const tempCarDownMarkers = new THREE.Object3D();
const tempCarOpenMarkers = new THREE.Object3D();
const tempCarClosedMarkers = new THREE.Object3D();

const CarUpMarkerInstances = ({ carUpMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0xc70039 });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (carUpMarkers.length > 0) {
      let counter = 0;
      carUpMarkers.forEach((marker) => {
        const id = counter++;
        tempCarUpMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempCarUpMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempCarUpMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, carUpMarkers.length]} />;
};

const CarDownMarkerInstances = ({ carDownMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0x00a36c });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (carDownMarkers.length > 0) {
      let counter = 0;
      carDownMarkers.forEach((marker) => {
        const id = counter++;
        tempCarDownMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempCarDownMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempCarDownMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, carDownMarkers.length]} />;
};

const CarOpenMarkerInstances = ({ carOpenMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0x0040ff });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (carOpenMarkers.length > 0) {
      let counter = 0;
      carOpenMarkers.forEach((marker) => {
        const id = counter++;
        tempCarOpenMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempCarOpenMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempCarOpenMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, carOpenMarkers.length]} />;
};

const CarClosedMarkerInstances = ({ carClosedMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0xffff8f });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (carClosedMarkers.length > 0) {
      let counter = 0;
      carClosedMarkers.forEach((marker) => {
        const id = counter++;
        tempCarClosedMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempCarClosedMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempCarClosedMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, carClosedMarkers.length]} />;
};

const PedestrianOpenMarkers = ({ pedestrianOpenMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0xcf9fff });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (pedestrianOpenMarkers.length > 0) {
      let counter = 0;
      pedestrianOpenMarkers.forEach((marker) => {
        const id = counter++;
        tempOpenMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempOpenMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempOpenMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, pedestrianOpenMarkers.length]} />;
};

const PedestrianClosedMarkers = ({ pedestrianClosedMarkers }) => {
  const material = new THREE.MeshPhongMaterial({ color: 0x0047ab });
  const geometry = new THREE.SphereGeometry(0.05, 10);
  const ref = useRef();

  useLayoutEffect(() => {
    if (pedestrianClosedMarkers.length > 0) {
      let counter = 0;
      pedestrianClosedMarkers.forEach((marker) => {
        const id = counter++;
        tempClosedMarkers.position.set(marker.position.x, 0.075, marker.position.z);
        tempClosedMarkers.updateMatrix();
        ref.current.setMatrixAt(id, tempClosedMarkers.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, pedestrianClosedMarkers.length]} />;
};

const Markers = ({ entityManager }) => {
  const [pedestrianOpenMarkers, setPedestrianOpenMarkers] = useState([]);
  const [pedestrianClosedMarkers, setPedestrianClosedMarkers] = useState([]);
  const [carOpenMarkers, setCarOpenMarkers] = useState([]);
  const [carClosedMarkers, setCarClosedMarkers] = useState([]);
  const [carUpMarkers, setCarUpMarkers] = useState([]);
  const [carDownMarkers, setCarDownMarkers] = useState([]);

  useLayoutEffect(() => {
    const roads = entityManager.entities.filter((entity) => entity.type === 'road');
    let tempPedestrianOpen = [];
    let tempPedestrianClosed = [];
    let tempCarClosedMarkers = [];
    let tempCarOpenMarkers = [];
    let tempCarUpMarkers = [];
    let tempCarDownMarkers = [];
    roads.forEach((road) => {
      road.pedestrianMarkers.forEach((marker) => {
        if (marker.open === true) {
          tempPedestrianOpen.push(marker);
        } else {
          tempPedestrianClosed.push(marker);
        }
      });
      setPedestrianOpenMarkers(tempPedestrianOpen);
      setPedestrianClosedMarkers(tempPedestrianClosed);
      road.carMarkers.forEach((marker) => {
        if (marker.upMarker === true) {
          tempCarUpMarkers.push(marker);
        } else if (marker.upMarker === false) {
          tempCarDownMarkers.push(marker);
        } else if (marker.open === true) {
          tempCarOpenMarkers.push(marker);
        } else {
          tempCarClosedMarkers.push(marker);
        }
      });
      setCarUpMarkers(tempCarUpMarkers);
      setCarDownMarkers(tempCarDownMarkers);
      setCarOpenMarkers(tempCarOpenMarkers);
      setCarClosedMarkers(tempCarClosedMarkers);
    });
  }, []);

  return (
    <>
      <PedestrianOpenMarkers pedestrianOpenMarkers={pedestrianOpenMarkers} />
      <PedestrianClosedMarkers pedestrianClosedMarkers={pedestrianClosedMarkers} />
      <CarUpMarkerInstances carUpMarkers={carUpMarkers} />
      <CarDownMarkerInstances carDownMarkers={carDownMarkers} />
      <CarOpenMarkerInstances carOpenMarkers={carOpenMarkers} />
      <CarClosedMarkerInstances carClosedMarkers={carClosedMarkers} />
    </>
  );
};

export default Markers;
