import React, { useState, useEffect } from "react";

export default function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetch("http://localhost:3001/benchmarks")
			.then((response) => response.json())
			.then((actualData) => {
				setData(actualData);
				console.log(actualData);
				setLoading(false);
			})
			.catch((err) => {
				setError(err);
				setLoading(false);
			});
	}, []);

	return (
		<div>
			{loading ? <p>Loading...</p> : <p>Data Loaded</p>}
		</div>
	);
}
