export default function layoutFamilyTree(nodes) {
  const NODE_WIDTH = 80;
  const NODE_HEIGHT = 40;
  const NODE_SPACING_X = 20;
  const NODE_SPACING_Y = 100;

  const idToNode = {};
  const generationMap = {};
  const gens = {};

  nodes.forEach(node => {
    idToNode[node.id] = node;
  });

  // Step 1: BFS to assign generation levels
  const queue = [];
  nodes.forEach(node => {
    if (!node.pred || node.pred.length === 0) {
      queue.push({ id: node.id, gen: 0 });
    }
  });

  while (queue.length > 0) {
    const { id, gen } = queue.shift();
    generationMap[id] = Math.max(gen, generationMap[id] || 0);
    const succ = idToNode[id].succ || [];
    succ.forEach(childId => {
      queue.push({ id: childId, gen: gen + 1 });
    });
  }

  // Step 2: Group nodes by generation
  for (const [id, gen] of Object.entries(generationMap)) {
    if (!gens[gen]) gens[gen] = [];
    gens[gen].push(id);
  }

  // Step 3: Assign positions
  const positioned = new Set();
  const yMap = {};
  for (const gen in gens) {
    yMap[gen] = parseInt(gen) * (NODE_HEIGHT + NODE_SPACING_Y);
  }

  for (const gen of Object.keys(gens).map(Number).sort((a, b) => a - b)) {
    let xCursor = 0;
    for (const id of gens[gen]) {
      if (positioned.has(id)) continue;
      const node = idToNode[id];
      node.position = {
        x: xCursor,
        y: yMap[gen],
      };
      positioned.add(id);
      xCursor += NODE_WIDTH + NODE_SPACING_X;
    }
  }

  return Object.values(idToNode);
}