import { Handle, Position } from "reactflow";

const PersonNode = ({ data }) => (
	<div className="bg-white border-2 border-black rounded-md p-2 text-center w-[80px] h-[40px] flex items-center justify-center shadow">
		<Handle type="target" position={Position.Top} id="top-in" />
		<Handle type="target" position={Position.Left} id="left-in" />
		<Handle type="target" position={Position.Right} id="right-in" />
		<Handle type="source" position={Position.Bottom} id="bottom-out" />
		<Handle type="source" position={Position.Left} id="left-out" />
		<Handle type="source" position={Position.Right} id="right-out" />
		<div className="font-semibold">{data.label}</div>
	</div>
);

export default PersonNode;
