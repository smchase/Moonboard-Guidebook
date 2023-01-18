import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

export default function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const urlBase = 'http://localhost:3001/benchmarks?';
	const [query, setQuery] = useState('mb_type=0');
	useEffect(() => {
		const getData = async () => {
			try {
				const response = await axios.get(urlBase + query);
				setData(response.data);
				setError(null);
			} catch (err) {
				setError(err.message);
				setData(null);
			} finally {
				setLoading(false);
			}
		}
		getData();
	}, [query]);

	const mapGrades = {
		0: '5+ (V2)',
		1: '6A (V3)',
		2: '6A+ (V3)',
		3: '6B (V4)',
		4: '6B+ (V4)',
		5: '6C (V5)',
		6: '6C+ (V5)',
		7: '7A (V6)',
		8: '7A+ (V7)',
		9: '7B (V8)',
		10: '7B+ (V8)',
		11: '7C (V9)',
		12: '7C+ (V10)',
		13: '8A (V11)',
		14: '8A+ (V12)',
		15: '8B (V13)',
		16: '8B+ (V14)',
		17: '8C (V15)',
	}
	return (
		<div>
			<h1><center>Moonboard Guidebook</center></h1>
			{loading && <div>Loading...</div>}
			{error && <div>Error: {error}</div>}
			{data && (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Setter</th>
							<th>Grade</th>
							<th>Sandbaggedness</th>
							<th>Repeats</th>
							<th>User Stars</th>
							<th>Average Attempts</th>
							<th>Hold Sets</th>
							<th>Date Created</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr key={row.id}>
								<td>{row.name}</td>
								<td>{row.setter}</td>
								<td>{mapGrades[row.official_grade]}{row.upgraded ? ' \u25B2' : null} {row.downgraded ? ' \u25BC' : null}</td>
								<td style={{color: row.user_grade > row.official_grade+0.1 ? 'red' : row.user_grade < row.official_grade-0.1 ? 'green' : 'black'}}>{Math.round((row.user_grade - row.official_grade) * 1000) / 100}</td>
								<td>{row.repeats}</td>
								<td>{row.user_stars}</td>
								<td>{row.user_attempts}</td>
								<td>
									{row.holdsets.includes(1) ? <img src='white-hold.png'></img> : null}
									{row.holdsets.includes(2) ? <img src='black-hold.png'></img> : null}
									{row.holdsets.includes(0) ? <img src='yellow-hold.png'></img> : null}
								</td>
								<td>{row.date_created.substring(0, 10).split("-").join("/")}</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</div>
	);
}
