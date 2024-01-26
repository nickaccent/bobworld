import Vertex from './Vertex';

class AdjacencyGraph {
  constructor() {
    this.adjacencyArray = [];
  }

  AddVertexByPosition(position) {
    if (this.GetVertexAt(position) !== null) {
      return null;
    }
    const v = new Vertex(position);
    this.AddVertex(v);
    return v;
  }

  AddVertex(v) {
    if (
      this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === v.ToString()).length > 0
    ) {
      return null;
    }
    this.adjacencyArray.push({ key: v.ToString(), vertex: v, list: [] });
  }

  GetVertexAt(position) {
    let tempV = new Vertex(position);
    let vertices = this.adjacencyArray.filter(
      (adjacencyItem) => adjacencyItem.key === tempV.ToString(),
    );
    if (vertices.length > 0) {
      return vertices[0];
    }
    return null;
  }

  GetVertexByKey(key) {
    let vertices = this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === key);
    if (vertices.length > 0) {
      return vertices[0];
    }
    return null;
  }

  CompareVertices(position1, position2) {
    return position1.distanceToSquared(position2) < 0.0001;
  }

  AddEdge(position1, position2) {
    if (this.CompareVertices(position1, position2)) {
      return null;
    }

    let v1 = this.GetVertexAt(position1);
    let v2 = this.GetVertexAt(position2);
    if (v1 == null) {
      v1 = new Vertex(position1);
    }
    if (v2 == null) {
      v2 = new Vertex(position2);
    }
    this.AddEdgeBetween(v1, v2);
    this.AddEdgeBetween(v2, v1);
  }

  AddEdgeBetween(v1, v2) {
    if (typeof v1 === 'Vertex' && typeof v2 === 'Vertex') {
      if (v1 == v2) {
        return null;
      }
    }

    let v1Key = '';
    let v2Key = '';
    if (v1.constructor.name === 'Vertex') {
      v1Key = v1.ToString();
    } else {
      v1Key = v1.vertex.ToString();
    }
    if (v2.constructor.name === 'Vertex') {
      v2Key = v2.ToString();
    } else {
      v2Key = v2.vertex.ToString();
    }

    let adjacencyV1 = this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === v1Key);
    if (adjacencyV1.length > 0) {
      if (adjacencyV1[0].list.filter((item) => item.key === v2Key).length == 0) {
        if (v2.constructor.name === 'Vertex') {
          adjacencyV1[0].list.push({ key: v2.ToString(), vertex: v2, list: [] });
        } else {
          adjacencyV1[0].list.push(v2);
        }
      }
    } else {
      this.AddVertex(v1);
      let adjacencyV1 = this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === v1Key);
      if (v2.constructor.name === 'Vertex') {
        adjacencyV1[0].list.push({ key: v2.ToString(), vertex: v2, list: [] });
      } else {
        adjacencyV1[0].list.push(v2);
      }
    }
  }

  GetConnectedVerticesTo(v1) {
    let adjacancyV1 = this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === v1);
    if (adjacancyV1.length > 0) {
      return adjacancyV1[0].list;
    }
    return null;
  }

  GetConnectedVerticesToPosition(position) {
    let v1 = this.GetVertexAt(position);
    if (v1 === null) {
      return null;
    }

    return this.adjacencyArray.filter((adjacencyItem) => adjacencyItem.key === v1.ToString()).list;
  }

  ClearGraph() {
    this.adjacencyArray = [];
  }

  GetVertices() {
    return this.adjacencyArray.map(function (el) {
      return el.key;
    });
  }

  ToString() {
    let strText = '';
    this.adjacencyArray.forEach((item) => {
      strText +=
        'Vertex: ' +
        item.key +
        ' neighbours: ' +
        item.list.map(function (el) {
          return el.ToString() + ', ';
        });
    });
    return strText;
  }

  AStarSearch(graph, startPosition, endPosition) {
    let path = [];
    let positionsToCheck = [];
    let costsDictionary = new Map();
    let priorityDictionary = new Map();
    let parentsDictionary = new Map();

    let start = graph.GetVertexAt(startPosition);
    let end = graph.GetVertexAt(endPosition);

    positionsToCheck.push(start);
    if (typeof start !== 'undefined' && start !== null) {
      if (start.hasOwnProperty('key') && typeof start.key !== 'undefined') {
        priorityDictionary.set(start.key, 0);
        costsDictionary.set(start.key, 0);
        parentsDictionary.set(start.key, null);
      }
    }

    while (positionsToCheck.length > 0) {
      let current = this.GetClosestVertex(positionsToCheck, priorityDictionary);

      positionsToCheck = positionsToCheck.filter((item) => item.key !== current.key);
      if (current.vertex.Equals(endPosition)) {
        path = this.GeneratePath(parentsDictionary, end);
        return path;
      }
      let connected = graph.GetConnectedVerticesTo(current.key);
      connected.forEach((neighbour) => {
        let newCost = costsDictionary.get(current.key) + 1;
        let currentCost = costsDictionary.has(current.key);
        let neighbourCost = costsDictionary.has(neighbour.key);
        if (currentCost === true && neighbourCost === true) {
          if (newCost < neighbourCost) {
            let costsDict = costsDictionary.get(neighbour.key);
            costsDict = newCost;
            let priority = newCost + this.ManhattenDistance(end.vertex, neighbour.vertex);
            positionsToCheck.push(neighbour);
            let priorityDict = priorityDictionary.get(neighbour.key);
            priorityDict = priority;
            let parentsDict = parentsDictionary.get(neighbour.key);
            parentsDict = current.key;
          }
        } else if (currentCost === true && neighbourCost === false) {
          costsDictionary.set(neighbour.key, newCost);
          let priority = newCost + this.ManhattenDistance(end.vertex, neighbour.vertex);
          positionsToCheck.push(neighbour);
          priorityDictionary.set(neighbour.key, priority);
          parentsDictionary.set(neighbour.key, current.key);
        }
      });
    }
    return path;
  }

  GetClosestVertex(list, distanceMap) {
    let candidate = list[0];
    list.forEach((vertex) => {
      if (distanceMap[vertex] < distanceMap[candidate]) {
        candidate = vertex;
      }
    });
    return candidate;
  }

  ManhattenDistance(endPos, position) {
    return (
      Math.abs(endPos.position.x - position.position.x) +
      Math.abs(endPos.position.y - position.position.y)
    );
  }

  GeneratePath(parentMap, endState) {
    let path = [];
    let parent = endState.key;
    while (parent != null && parentMap.has(parent)) {
      let parentObj = this.GetVertexByKey(parent);
      path.push(parentObj.vertex.position);
      parent = parentMap.get(parent);
    }
    return path;
  }
}

export default AdjacencyGraph;
