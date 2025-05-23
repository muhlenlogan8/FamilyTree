export function arrangeFamilyTreeNodes(nodes) {
  // Assign generations to each node
  assignGenerations(nodes);

  // Create clusters of spouses
  const clusters = createClusters(nodes);

  // Build cluster relationships (parents and children)
  const clusterRelations = buildClusterRelationships(clusters, nodes);

  // Calculate initial positions for clusters
  calculateClusterPositions(clusterRelations);

  // Adjust positions to prevent overlaps and maintain spacing
  adjustClusterSpacing(clusterRelations);

  // Position each node within its cluster
  positionNodesInClusters(clusters, clusterRelations);

  return nodes;
}

function assignGenerations(nodes) {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const queue = [];
  
  // Initialize root nodes (no predecessors)
  nodes.forEach(node => {
    if (!node.pred || node.pred.length === 0) {
      node.generation = 0;
      queue.push(node);
    }
  });

  // Process nodes in BFS order to assign generations
  while (queue.length > 0) {
    const current = queue.shift();
    for (const succId of current.succ || []) {
      const succNode = nodeMap.get(succId);
      if (succNode.generation === undefined) {
        const allPredsAssigned = succNode.pred.every(predId => {
          const predNode = nodeMap.get(predId);
          return predNode.generation !== undefined;
        });
        if (allPredsAssigned) {
          const maxParentGen = Math.max(...succNode.pred.map(predId => 
            nodeMap.get(predId).generation));
          succNode.generation = maxParentGen + 1;
          queue.push(succNode);
        }
      }
    }
  }
}

function createClusters(nodes) {
  const visited = new Set();
  const clusters = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const cluster = [];
      const queue = [node];
      while (queue.length > 0) {
        const current = queue.shift();
        if (!visited.has(current.id)) {
          visited.add(current.id);
          cluster.push(current);
          // Add all related nodes (spouses)
          (current.rel || []).forEach(relId => {
            const relNode = nodeMap.get(relId);
            if (relNode && !visited.has(relNode.id)) {
              queue.push(relNode);
            }
          });
        }
      }
      clusters.push(cluster);
    }
  }
  return clusters;
}

function buildClusterRelationships(clusters, nodes) {
  const nodeToCluster = new Map();
  clusters.forEach((cluster, index) => {
    cluster.forEach(node => nodeToCluster.set(node.id, index));
  });

  const clusterRelations = clusters.map(cluster => ({
    parents: new Set(),
    children: new Set(),
    generation: cluster[0].generation,
    nodes: cluster,
    x: 0, // Midpoint x-coordinate
    width: 0, // Total width of the cluster
  }));

  clusters.forEach((cluster, clusterIndex) => {
    cluster.forEach(node => {
      node.pred.forEach(predId => {
        const parentClusterIndex = nodeToCluster.get(predId);
        if (parentClusterIndex !== undefined) {
          clusterRelations[clusterIndex].parents.add(parentClusterIndex);
          clusterRelations[parentClusterIndex].children.add(clusterIndex);
        }
      });
    });
  });

  return clusterRelations;
}

function calculateClusterPositions(clusterRelations) {
  const generations = new Map();
  clusterRelations.forEach((cluster, index) => {
    const gen = cluster.generation;
    if (!generations.has(gen)) generations.set(gen, []);
    generations.get(gen).push(index);
  });

  // Process from oldest to youngest generation
  const sortedGens = Array.from(generations.keys()).sort((a, b) => a - b);
  for (const gen of sortedGens) {
    const clusterIndices = generations.get(gen);
    clusterIndices.forEach(clusterIndex => {
      const cluster = clusterRelations[clusterIndex];
      if (cluster.parents.size === 0) {
        // Root cluster, start at x=0 (adjusted later)
        cluster.x = 0;
      } else {
        // Midpoint is average of all parent cluster midpoints
        const parentClusters = Array.from(cluster.parents).map(p => clusterRelations[p]);
        const sumX = parentClusters.reduce((sum, parent) => sum + parent.x, 0);
        cluster.x = sumX / parentClusters.length;
      }
    });
  }
}

function adjustClusterSpacing(clusterRelations) {
  const generations = new Map();
  clusterRelations.forEach(cluster => {
    const gen = cluster.generation;
    if (!generations.has(gen)) generations.set(gen, []);
    generations.get(gen).push(cluster);
  });

  generations.forEach((clusters, gen) => {
    // Sort clusters by their current x
    clusters.sort((a, b) => a.x - b.x);
    let currentX = 0;
    clusters.forEach(cluster => {
      // Calculate cluster width (nodes + spacing)
      const nodeWidth = 80;
      const spacing = 20;
      cluster.width = (nodeWidth * cluster.nodes.length) + (spacing * (cluster.nodes.length - 1));
      const desiredLeft = currentX;
      cluster.x = desiredLeft + cluster.width / 2;
      currentX += cluster.width + spacing;
    });
  });
}

function positionNodesInClusters(clusters, clusterRelations) {
  clusterRelations.forEach(cluster => {
    let x = cluster.x - cluster.width / 2; // Start from leftmost position
    const y = cluster.generation * 120; // 40px height + 80px spacing
    cluster.nodes.forEach(node => {
      node.position = { x: x, y: y };
      x += 80 + 20; // Move right by node width + spacing
    });
  });
}