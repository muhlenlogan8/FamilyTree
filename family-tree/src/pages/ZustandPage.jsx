import { useTreeStore } from "../store/useTreeStore";

const ZustandPage = () => {
    const { nodes, addNode, removeNode } = useTreeStore();

    const handleAddNode = () => {
        const id = crypto.randomUUID();
        addNode({ id, name: `Person ${nodes.length + 1}` });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4"> Zustand Store Demo</h1>
            <button onClick={handleAddNode} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Person</button>
            <ul className="space-y-2">
                {nodes.map((node) => (
                    <li key={node.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span>{node.name}</span>
                        <button onClick={() => removeNode(node.id)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default ZustandPage;
