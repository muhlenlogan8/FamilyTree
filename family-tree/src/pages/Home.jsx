import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-2xl font-bold mb-6">FamilyTree Demo Home</h1>
			<button
				className="bg-blue-600 text-white px-6 py-2 rounded shadow"
				onClick={() => navigate("/reactflow")}
			>
				Go to ReactFlow
			</button>
			<button
				className="bg-green-600 text-white px-6 py-2 rounded shadow"
				onClick={() => navigate("/yjs")}
			>
				Go to YJS
			</button>
			<button
				className="bg-purple-600 text-white px-6 py-2 rounded shadow"
				onClick={() => navigate("/zustand")}
			>
				Go to Zustand
			</button>
		</div>
	);
};

export default Home;
