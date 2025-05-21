import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TreeScene from "./pages/TreeScene.jsx";
import ReactFlowPage from "./pages/ReactFlowPage.jsx";
import Zustand from "./pages/ZustandPage.jsx";
import YJS from "./pages/YJSPage.jsx";

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/reactflow" element={<ReactFlowPage />} />
			<Route path="/zustand" element={<Zustand />} />
			<Route path="/yjs" element={<YJS />} />
		</Routes>
	);
};

export default App;
