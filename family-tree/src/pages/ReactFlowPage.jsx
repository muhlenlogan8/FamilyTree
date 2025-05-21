import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
	{
		id: "1",
		position: { x: 100, y: 100 },
		data: { label: "Person A" },
		type: "default",
	},
	{
		id: "2",
		position: { x: 300, y: 200 },
		data: { label: "Person B" },
		type: "default",
	},
];

const initialEdges = [
	{ id: "e1-2", source: "1", target: "2", label: "Partner" },
];

// Rename the component to avoid naming conflict
const ReactFlowPage = () => {
	return (
		<div className="w-screen h-screen">
			<ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default ReactFlowPage;
