class Vertex {
  constructor(position) {
    this.position = position;
  }

  Equals(other) {
    return this.position.distanceToSquared(other) < 0.0001;
  }

  GetPosition() {
    return this.position;
  }

  ToString() {
    return `x${this.position.x}-y${this.position.y}-z${this.position.z}`;
  }
}

export default Vertex;
