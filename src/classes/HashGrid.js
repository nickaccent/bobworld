class HashGrid {
  constructor(dimensions, cells) {
    const [x, y] = dimensions;
    this.dimensions = dimensions;
    this.cells = cells;
  }

  GetCellByKey(key) {
    return this.cells.filter((cell) => cell.key === key)[0];
  }

  NewClient(position, dimensions, walkable, entity_id, type) {
    const client = {
      position: position,
      dimensions: dimensions,
      indices: null,
      walkable: walkable,
      entity_id: entity_id,
      type: type,
    };
    this.InsertClient(client);

    return client;
  }

  InsertClient(client) {
    const [x, y] = client.position;
    const [w, h] = client.dimensions;

    client.indices = [x, y];

    const k = this.Key(x, y);
    const cell = this.GetCellByKey(k);
    if (cell !== null) {
      cell.set.push(client);
      if (client.type === 'road') {
        cell.type = 'ROAD';
      }
      if (client.type === 'residential') {
        cell.type = 'RESIDENTIAL';
      }
      if (client.type === 'commercial') {
        cell.type = 'COMMERCIAL';
      }
      if (client.type === 'industrial') {
        cell.type = 'INDUSTRIAL';
      }
      if (client.type === 'power' || client.type === 'water') {
        cell.type = 'UTILITY';
      }
    }
  }

  Key(x, y) {
    return `${x}.${y}`;
  }

  FindNear(position) {
    const [xpos, ypos] = position;
    const searchKey = this.Key(xpos, ypos);
    const clients = [];

    for (let x = xpos - 1; x <= xpos + 1; x++) {
      for (let y = ypos - 1; y <= ypos + 1; y++) {
        if (x >= 0 && y >= 0 && x < this.dimensions[0] && y < this.dimensions[1]) {
          const k = this.Key(x, y);
          const cell = this.GetCellByKey(k);
          if (cell !== null) {
            if (k !== searchKey) {
              for (let v of cell.set) {
                clients.push(v);
              }
            }
          }
        }
      }
    }
    return clients;
  }

  FindNearRestricted(position) {
    const [xpos, ypos] = position;
    const clients = [];

    // up
    let k = this.Key(xpos, ypos + 1);
    let cell = this.GetCellByKey(k);
    if (typeof cell !== 'undefined' && cell !== null) {
      for (let v of cell.set) {
        clients.push(v);
      }
    }

    // down
    k = this.Key(xpos, ypos - 1);
    cell = this.GetCellByKey(k);
    if (typeof cell !== 'undefined' && cell !== null) {
      for (let v of cell.set) {
        clients.push(v);
      }
    }

    // left
    k = this.Key(xpos - 1, ypos);
    cell = this.GetCellByKey(k);
    if (typeof cell !== 'undefined' && cell !== null) {
      for (let v of cell.set) {
        clients.push(v);
      }
    }

    // right
    k = this.Key(xpos + 1, ypos);
    cell = this.GetCellByKey(k);
    if (typeof cell !== 'undefined' && cell !== null) {
      for (let v of cell.set) {
        clients.push(v);
      }
    }

    return clients;
  }

  UpdateClient(client) {
    this.RemoveClient(client);
    this.InsertClient(client);
  }

  RemoveClient(client) {
    const [x, y] = client.indices;
    const k = this.Key(x, y);
    const cell = this.GetCellByKey(k);
    if (cell !== null) {
      cell.set = cell.set.filter((c) => c.entity_id !== client.entity_id);
    }
  }

  CheckPositionIsFree(x, y) {
    const k = this.Key(x, y);
    const cell = this.GetCellByKey(k);
    if (cell !== null) {
      if (cell.type === 'EMPTY') {
        return true;
      }
      return false;
    }
    return false;
  }
}

export default HashGrid;
