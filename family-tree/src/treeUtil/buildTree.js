import { nodes } from "./testData.js";

export function buildTree(nodes) {
	return nodes;
}

// function assignGenerations(nodes) {
// 	// Create an object to map each node's id to the actual node object
// 	const nodeMap = {};
// 	// Iterate through the nodes and populate the nodeMap (Makes look up fast instead of looping through list every time)
// 	nodes.forEach((node) => {
// 		nodeMap[node.id] = node;
// 	});

// 	// Create memo object to store the computed generation of each node (Technique to avoid redoing calculations)
// 	const memo = {};

// 	// Nested function to calculate the generation depth of a node with id nodeId
// 	function getDepth(nodeId) {
// 		// If we've already calculated the node's depth, return it (Skip calculating it again)
// 		if (memo[nodeId] !== undefined) {
// 			return memo[nodeId];
// 		}

// 		// Look up the node in the nodeMap using its id
// 		const node = nodeMap[nodeId];

// 		// If the node doesn't exist or has no children (succ is empty), then its a leaf node and assign gen = 0
// 		if (!node || !node.succ || node.succ.length === 0) {
// 			memo[nodeId] = 0;
// 			return 0;
// 		}

// 		// Recursively call getDepth for each child (succ) of this node (.map(...) means run ... function on ever element of succ and return array of results)
// 		const childDepths = node.succ.map(getDepth);

// 		// Get deepest child depth and add 1 to it (Makes the current node 1 level above its deepest child)
// 		const depth = 1 + Math.max(...childDepths);

// 		// Store this result in memo to avoid recalculating it in the future
// 		memo[nodeId] = depth;
// 		return depth;
// 	}

// 	// Call getDepth for ever node in the list and store result into node.get
// 	nodes.forEach((node) => {
// 		node.gen = getDepth(node.id);
// 	});

// 	// Return the updated nodes with their generation levels
// 	return nodes;
// }

// function assignGenerations(nodes) {
// 	// Create a Map for fast lookups via node ids
// 	const nodeMap = new Map();
// 	nodes.forEach((node) => {
// 		nodeMap.set(node.id, node);
// 		node.gen = null; // Initialize gen
// 	});

// 	// Helper function to perform set gen by performing breadth first traversal starting from any given node
// 	function setGen(id, gen) {
// 		const queue = [{ id, gen }]; // Initialize queue to manage traversal
// 		const seen = new Set(); // Track seen nodes to avoid cycles (infinite loops)

// 		while (queue.length > 0) {
// 			const { id, gen } = queue.shift(); // Dequeue the first element
// 			const node = nodeMap.get(id); // Get the node from the map
// 			if (!node || seen.has(id)) continue; // Skip if node doesn't exist or already seen
// 			seen.add(id); // Mark this node as seen

// 			// Assign generation or the node
// 			if (node.gen === null || node.gen < gen) {
// 				node.gen = gen; // Assign the generation
// 			}

// 			// Enqueue all predecessors (pred) of the current node with decremented generation and siblings with same generation
// 			for (const predId of node.pred || []) {
// 				const parent = nodeMap.get(predId); // Get the parent node
// 				if (parent) {
// 					queue.push({ id: predId, gen: gen - 1 }); // Enqueue the parent with decrement generation

// 					// Add siblings to the queue
// 					for (const sibId of parent.succ || []) {
// 						if (!seen.has(sibId)) queue.push({ id: sibId, gen }); // Enqueue siblings with same generation
// 					}
// 				}
// 			}

// 			// Enqueue all successors (succ) of the current node with incremented generation
// 			for (const succId of node.succ || []) {
// 				const child = nodeMap.get(succId); // Get the child node
// 				if (child) {
// 					queue.push({ id: succId, gen: gen + 1 }); // Enqueue the child with incremented generation

// 					// Add all the successors siblings to the queue
// 					for (const parentId of child.pred || []) {
// 						const parent = nodeMap.get(parentId); // Get the parent node
// 						if (parent) {
// 							for (const sibId of parent.succ || []) {
// 								if (!seen.has(sibId)) queue.push({ id: sibId, gen: gen + 1 }); // Enqueue siblings with incremented generation
// 							}
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}

// 	// Start traversal
// 	if (nodes.length > 0) {
// 		setGen(nodes[0].id, 0); // Start from the first node with gen 0
// 	}

// 	// Normalize the generation values to start from 0
// 	const minGen = Math.min(...nodes.map((node) => node.gen ?? 0));
// 	nodes.forEach((node) => {
// 		if (node.gen != null) node.gen -= minGen; // Normalize the generation value
// 	});

// 	return nodes;
// }

function assignGeneration(nodes) {
	// Create Map for fast lookups via node ids
	const nodeMap = new Map(nodes.map((node) => [node.id, node]));
	const seen = new Set(); // Set to track seen nodes
	const predList = []; // store unique predecessors for each node
	const succList = []; // store unique successors for each node
	const rowList = []; // store unique accessable nodes in that row
	const tempList = []; // List of nodes to process
	const generation = 0; // Generation level

	// Helper function to go through node and get information
	function processNode(id) {
		const node = nodeMap.get(id);
		if (!node || seen.has(id)) return; // Skip if node doesn't exist or already seen
		seen.add(id); // Mark this node as seen

		// Store unique predecessors, successors, relationships and siblings of node
		node.pred.forEach((predId) => {
			if (!predList.includes(predId) || seen.has(predId)) predList.push(predId);
		});
		node.succ.forEach((succId) => {
			if (!succList.includes(succId) || seen.has(succId)) succList.push(succId);
		});
		node.rel.forEach((relId) => {
			if (!rowList.includes(relId)) {
				rowList.push(relId);
				tempList.push(relId); // Add to tempList to process potentially new node
			}
		});
		// For each parent (pred), get their succ list and add all their children (siblings) into rowList
		node.pred.forEach((parentId) => {
			const parent = nodeMap.get(parentId);
			if (parent) {
				parent.succ.forEach((siblingId) => {
					if (siblingId !== id && !rowList.includes(siblingId)) {
						rowList.push(siblingId);
						tempList.push(siblingId); // Add to tempList to process potentially new node
					}
				});
			}
		});
	}

	// Maybe can use Helper function to find if there is a node on the same row via a deep traversal connection
	// function findRowNodes(id) {
	// 	const row = 0;
	// 	const node = nodeMap.get(id);
		
	// }

	// Add first node to temp list
	// if (nodes.length > 0) {
	// 	tempList.push(nodes[0].id); // Start from the first node
	// }
	tempList.push("D"); // Start from the first node

	// While we still have temp nodes to process
	while (tempList.length > 0) {
		const currentId = tempList.shift(); // Get the first node from the list and remove it from tempList
		console.log("Processing node:", currentId);
		const currentNode = nodeMap.get(currentId); // Get the node from the map
		if (!currentNode) continue; // Skip if node doesn't exist
		processNode(currentId); // Process the current node
		if (tempList.length === 0) {
			// Go through rowList and set gen for each node
			rowList.forEach((rowId) => {
				const rowNode = nodeMap.get(rowId);
				rowNode.gen = generation; // Set the generation for the node
			});
			// Clear rowList for next generation
			rowList.length = 0; // Clear the rowList for the next generation
			generation++; // Increment the generation level
			// Add successors to tempList for processing the next row
			succList.forEach((succId) => {
				tempList.push(succId); // Add successors to tempList for processing
			});
			succList.length = 0; // Clear the succList for the next generation
		}
		// If tempList still is empty (i.e. all successors processed from starting node) then go up instead but not easy since I need to figure out how to go up through 4-5 and a-b sides
		if (tempList.length === 0) {}

	}

	// Maybe could just implement a big find function so I start at one node and set its gen to 0 then go through all other nodes and traverse up and down and left and right to find that node somehow
	// and if you go up you dec gen and if you go down you inc gen

	// Helper function to print array contents
	function printList(list, name) {
		console.log(`${name}: [${list.join(", ")}]`);
	}

	printList(predList, "predList");
	printList(succList, "succList");
	printList(rowList, "rowList");
}

// const result = assignGenerations(nodes);

// result.forEach((node) => {
// 	console.log(`${node.id}: gen ${node.gen}`);
// });

assignGeneration(nodes);