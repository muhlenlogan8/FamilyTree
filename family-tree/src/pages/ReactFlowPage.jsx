import ReactFlow, { Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { arrangeFamilyTreeNodes } from "../treeUtil/arrangeFamilyTreeNodes.js";
import { useEffect, useState } from "react";
import layoutFamilyTree from "../treeUtil/layoutFamilyTree.js";
import { buildTree } from "../treeUtil/buildTree.js";

const PersonNode = ({ data }) => (
	<div className="bg-white border-2 border-orange-400 rounded-md p-2 text-center w-[80px] h-[40px] flex items-center justify-center shadow">
		<Handle
			type="target"
			position={Position.Top}
			id="top"
			style={{
				top: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="target"
			position={Position.Left}
			id="left"
			style={{
				left: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="target"
			position={Position.Right}
			id="right"
			style={{
				right: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="source"
			position={Position.Bottom}
			id="bottom"
			style={{
				bottom: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="source"
			position={Position.Left}
			id="left"
			style={{
				left: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="source"
			position={Position.Right}
			id="right"
			style={{
				right: "10px",
				background: "transparent",
				border: "none",
			}}
		/>
		<div className="font-semibold">{data.label}</div>
	</div>
);

const ConnectorNode = () => (
	<div className="relative w-[1px] h-[1px]" style={{ pointerEvents: "none" }}>
		<Handle
			type="target"
			id="left-in"
			position={Position.Left}
			style={{
				left: "1px",
				bottom: "1px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="target"
			id="right-in"
			position={Position.Right}
			style={{
				right: "1px",
				bottom: "1px",
				background: "transparent",
				border: "none",
			}}
		/>
		<Handle
			type="source"
			id="bottom-out"
			position={Position.Bottom}
			style={{
				bottom: "1px",
				right: "1px",
				background: "transparent",
				border: "none",
			}}
		/>
	</div>
);

const nodeTypes = {
	personNode: PersonNode,
	connectorNode: ConnectorNode,
};

const nodes2 = [
	// Top-level parents
	{
		id: "F",
		type: "personNode",
		position: { x: 0, y: 0 },
		data: { label: "F" },
	},
	{
		id: "G",
		type: "personNode",
		position: { x: 100, y: 0 },
		data: { label: "G" },
	},
	{
		id: "H",
		type: "personNode",
		position: { x: 300, y: 0 },
		data: { label: "H" },
	},
	{
		id: "I",
		type: "personNode",
		position: { x: 400, y: 0 },
		data: { label: "I" },
	},

	// Connectors for F-G and H-I
	{
		id: "connector-F-G",
		type: "connectorNode",
		position: { x: 90, y: 20 },
		data: {},
	},
	{
		id: "connector-H-I",
		type: "connectorNode",
		position: { x: 390, y: 20 },
		data: {},
	},

	// Mid-generation parents
	{
		id: "A",
		type: "personNode",
		position: { x: 50, y: 100 },
		data: { label: "A" },
	},
	{
		id: "B",
		type: "personNode",
		position: { x: 350, y: 100 },
		data: { label: "B" },
	},

	// Connector for A-B
	{
		id: "connector-A-B",
		type: "connectorNode",
		position: { x: 240, y: 120 },
		data: {},
	},

	// Children
	{
		id: "C",
		type: "personNode",
		position: { x: 0, y: 250 },
		data: { label: "C" },
	},
	{
		id: "D",
		type: "personNode",
		position: { x: 140, y: 250 },
		data: { label: "D" },
	},
	{
		id: "E",
		type: "personNode",
		position: { x: 400, y: 250 },
		data: { label: "E" },
	},
	{
		id: "1",
		type: "personNode",
		position: { x: 260, y: 250 },
		data: { label: "1" },
	},
	// Connector for D-1
	{
		id: "connector-D-1",
		type: "connectorNode",
		position: { x: 240, y: 270 },
		data: {},
	},
	{
		id: "2",
		type: "personNode",
		position: { x: 140, y: 350 },
		data: { label: "2" },
	},
	{
		id: "3",
		type: "personNode",
		position: { x: 260, y: 350 },
		data: { label: "3" },
	},
];

const blankNodes = [
	{
		id: "A",
		type: "personNode",
		pred: ["F", "G"],
		succ: ["C", "D", "E"],
		rel: ["B"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "A" },
	},
	{
		id: "B",
		type: "personNode",
		pred: ["H", "I"],
		succ: ["C", "D", "E"],
		rel: ["A"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "B" },
	},
	{
		id: "C",
		type: "personNode",
		pred: ["A", "B"],
		succ: [],
		rel: [],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "C" },
	},
	{
		id: "D",
		type: "personNode",
		pred: ["A", "B"],
		succ: [],
		rel: [],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "D" },
	},
	{
		id: "E",
		type: "personNode",
		pred: ["A", "B"],
		succ: [],
		rel: [],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "E" },
	},
	{
		id: "F",
		type: "personNode",
		pred: [],
		succ: ["A"],
		rel: ["G"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "F" },
	},
	{
		id: "G",
		type: "personNode",
		pred: [],
		succ: ["A"],
		rel: ["F"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "G" },
	},
	{
		id: "H",
		type: "personNode",
		pred: [],
		succ: ["B"],
		rel: ["I"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "H" },
	},
	{
		id: "I",
		type: "personNode",
		pred: [],
		succ: ["B"],
		rel: ["H"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "I" },
	},
	{
		id: "1",
		type: "personNode",
		pred: [],
		succ: ["2", "3"],
		rel: ["D"],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "1" },
	},
	{
		id: "2",
		type: "personNode",
		pred: ["D", "1"],
		succ: [],
		rel: [],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "2" },
	},
	{
		id: "3",
		type: "personNode",
		pred: ["D", "1"],
		succ: [],
		rel: [],
		gen: 0,
		position: { x: 0, y: 0 },
		data: { label: "3" },
	},
];

// const edges = [
// 	// F-G to A
// 	{
// 		id: "F-connector",
// 		source: "F",
// 		sourceHandle: "right",
// 		target: "connector-F-G",
// 		targetHandle: "left-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "G-connector",
// 		source: "G",
// 		sourceHandle: "left",
// 		target: "connector-F-G",
// 		targetHandle: "right-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "connector-A",
// 		source: "connector-F-G",
// 		sourceHandle: "bottom-out",
// 		target: "A",
// 		targetHandle: "top",
// 		type: "straight",
// 	},

// 	// H-I to B
// 	{
// 		id: "H-connector",
// 		source: "H",
// 		sourceHandle: "right",
// 		target: "connector-H-I",
// 		targetHandle: "left-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "I-connector",
// 		source: "I",
// 		sourceHandle: "left",
// 		target: "connector-H-I",
// 		targetHandle: "right-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "connector-B",
// 		source: "connector-H-I",
// 		sourceHandle: "bottom-out",
// 		target: "B",
// 		targetHandle: "top",
// 		type: "straight",
// 	},

// 	// A-B to children C, D, E
// 	{
// 		id: "A-connector",
// 		source: "A",
// 		sourceHandle: "right",
// 		target: "connector-A-B",
// 		targetHandle: "left-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "B-connector",
// 		source: "B",
// 		sourceHandle: "left",
// 		target: "connector-A-B",
// 		targetHandle: "right-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "connector-C",
// 		source: "connector-A-B",
// 		sourceHandle: "bottom-out",
// 		target: "C",
// 		targetHandle: "top",
// 		type: "step",
// 	},
// 	{
// 		id: "connector-D",
// 		source: "connector-A-B",
// 		sourceHandle: "bottom-out",
// 		target: "D",
// 		targetHandle: "top",
// 		type: "step",
// 	},
// 	{
// 		id: "connector-E",
// 		source: "connector-A-B",
// 		sourceHandle: "bottom-out",
// 		target: "E",
// 		targetHandle: "top",
// 		type: "step",
// 	},
// 	// D to 1
// 	{
// 		id: "D-connector2",
// 		source: "D",
// 		sourceHandle: "right",
// 		target: "connector-D-1",
// 		targetHandle: "left-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "1-connector",
// 		source: "1",
// 		sourceHandle: "left",
// 		target: "connector-D-1",
// 		targetHandle: "right-in",
// 		type: "straight",
// 	},
// 	{
// 		id: "2-connector",
// 		source: "connector-D-1",
// 		sourceHandle: "bottom-out",
// 		target: "2",
// 		targetHandle: "top",
// 		type: "step",
// 	},
// 	{
// 		id: "3-connector",
// 		source: "connector-D-1",
// 		sourceHandle: "bottom-out",
// 		target: "3",
// 		targetHandle: "top",
// 		type: "step",
// 	},
// ];

const edges = [];

const ReactFlowPage = () => {
	const [nodes, setNodes] = useState([]);
	const handleBuildTree = () => {
		setNodes(buildTree(blankNodes));
	};

	useEffect(() => {
		setNodes(buildTree(blankNodes));
	}, []);

	return (
		<div className="w-screen h-screen">
			<div className="absolute top-4 left-4 z-10">
				<button
					onClick={handleBuildTree}
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
				>
					Build Tree
				</button>
			</div>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				defaultEdgeOptions={{
					style: {
						stroke: "#20a158", // line color
						strokeWidth: 2, // line thickness
					},
				}}
				nodesDraggable={false}
				elementsSelectable={false}
				panOnDrag
				zoomOnScroll
				zoomOnDoubleClick={true}
				fitView
			>
				{/* <Background /> */}
				<Controls showInteractive={false} />
			</ReactFlow>
		</div>
	);
};

export default ReactFlowPage;
