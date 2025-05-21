import React, { useState, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const doc = new Y.Doc();
const provider = new WebsocketProvider(
	"wss://demos.yjs.dev",
	"family-tree-demo",
	doc
);
const sharedCounter = doc.getMap("counter");

const YJSPage = () => {
	const [count, setCount] = useState(sharedCounter.get("value") || 0);

	useEffect(() => {
		const update = () => {
			setCount(sharedCounter.get("value") || 0);
		};
		sharedCounter.observe(update);
		return () => sharedCounter.unobserve(update);
	}, []);

	const increment = () => {
		sharedCounter.set("value", (sharedCounter.get("value") || 0) + 1);
	};

	return (
		<div className="p-4">
			<h1 className="text-xl font-bold mb-4"> Yjs Live Counter</h1>
			<p className="text-lg">Counter: {count}</p>
			<button
				onClick={increment}
				className="bg-green-600 text-white px-4 py-2 rounded mt-2"
			>
				Increment (Synced)
			</button>
		</div>
	);
};

export default YJSPage;
