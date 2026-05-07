import * as THREE from 'three';

class Marker {
  constructor(positionArray, open, upMarker, lane) {
    this.id = crypto.randomUUID();
    this.positionArray = positionArray;
    this.position = new THREE.Vector3(positionArray[0], positionArray[1], positionArray[2]);
    this.open = open;
    this.upMarker = upMarker;
    this.leftMarker = false;
    this.rightMarker = false;
    if (lane !== null && lane !== false) {
      if (lane === 'left') {
        this.leftMarker = true;
      } else {
        this.rightMarker = true;
      }
    }
    this.adjacentMarkers = [];
  }

  GetAdjacentPositions() {
    return this.adjacentMarkers.map((marker) => marker.position);
  }
}

export default Marker;
