import { nodes } from "./testData.js";

export function buildTree(nodes) {
	return nodes;
}

function assignGenerations(nodes) {
	// Create an object to map each node's id to the actual node object
	const nodeMap = {};
	// Iterate through the nodes and populate the nodeMap (Makes look up fast instead of looping through list every time)
	nodes.forEach((node) => {
		nodeMap[node.id] = node;
	});

	// Create memo object to store the computed generation of each node (Technique to avoid redoing calculations)
	const memo = {};

	// Nested function to calculate the generation depth of a node with id nodeId
	function getDepth(nodeId) {
		// If we've already calculated the node's depth, return it (Skip calculating it again)
		if (memo[nodeId] !== undefined) {
			return memo[nodeId];
		}

		// Look up the node in the nodeMap using its id
		const node = nodeMap[nodeId];

		// If the node doesn't exist or has no children (succ is empty), then its a leaf node and assign gen = 0
		if (!node || !node.succ || node.succ.length === 0) {
			memo[nodeId] = 0;
			return 0;
		}

		// Recursively call getDepth for each child (succ) of this node (.map(...) means run ... function on ever element of succ and return array of results)
		const childDepths = node.succ.map(getDepth);

		// Get deepest child depth and add 1 to it (Makes the current node 1 level above its deepest child)
		const depth = 1 + Math.max(...childDepths);

		// Store this result in memo to avoid recalculating it in the future
		memo[nodeId] = depth;
		return depth;
	}

	// Call getDepth for ever node in the list and store result into node.get
	nodes.forEach((node) => {
		node.gen = getDepth(node.id);
	});

	// Return the updated nodes with their generation levels
	return nodes;
}

const result = assignGenerations(nodes);

result.forEach((node) => {
	console.log(`${node.id}: gen ${node.gen}`);
});