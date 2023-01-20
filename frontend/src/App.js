import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Nav, Navbar, Spinner, Form, ToggleButton, Button, Collapse, Row, Col } from 'react-bootstrap';
import ScrollToTop from 'react-scroll-up';

export default function App() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [open, setOpen] = useState(false);
	const [sort, setSort] = useState({ column: 'date', order: 'asc' });

	const urlBase = 'http://localhost:3001/benchmarks?';
	const [query, setQuery] = useState('mb_type=0');
	useEffect(() => {
		setLoading(true);
		setSort({ column: null, order: null });
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

	function handleSort(column) {
		const order = sort.column === column && sort.order === 'asc' ? 'desc' : 'asc';
		setSort({ column, order });
		data.sort(compare(column, order));
	}
	function compare(column, order) {
		return function (a, b) {
			if (column === 'name') {
				if (order === 'asc') {
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'setter') {
				if (order === 'asc') {
					if (a['setter'].toLowerCase() < b['setter'].toLowerCase()) return -1;
					if (a['setter'].toLowerCase() > b['setter'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['setter'].toLowerCase() < b['setter'].toLowerCase()) return 1;
					if (a['setter'].toLowerCase() > b['setter'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'grade') {
				if (order === 'asc') {
					if (a['official_grade'] < b['official_grade']) return -1;
					if (a['official_grade'] > b['official_grade']) return 1;
					if (a['user_grade'] < b['user_grade']) return -1;
					if (a['user_grade'] > b['user_grade']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['official_grade'] < b['official_grade']) return 1;
					if (a['official_grade'] > b['official_grade']) return -1;
					if (a['user_grade'] < b['user_grade']) return 1;
					if (a['user_grade'] > b['user_grade']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'sandbag') {
				if (order === 'asc') {
					if (a['user_grade'] - a['official_grade'] < b['user_grade'] - b['official_grade']) return -1;
					if (a['user_grade'] - a['official_grade'] > b['user_grade'] - b['official_grade']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['user_grade'] - a['official_grade'] < b['user_grade'] - b['official_grade']) return 1;
					if (a['user_grade'] - a['official_grade'] > b['user_grade'] - b['official_grade']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'repeats') {
				if (order === 'asc') {
					if (a['repeats'] < b['repeats']) return -1;
					if (a['repeats'] > b['repeats']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['repeats'] < b['repeats']) return 1;
					if (a['repeats'] > b['repeats']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'stars') {
				if (order === 'asc') {
					if (a['user_stars'] < b['user_stars']) return -1;
					if (a['user_stars'] > b['user_stars']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['user_stars'] < b['user_stars']) return 1;
					if (a['user_stars'] > b['user_stars']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'attempts') {
				if (order === 'asc') {
					if (a['user_attempts'] < b['user_attempts']) return -1;
					if (a['user_attempts'] > b['user_attempts']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['user_attempts'] < b['user_attempts']) return 1;
					if (a['user_attempts'] > b['user_attempts']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'date') {
				if (order === 'asc') {
					if (a['id'] < b['id']) return -1;
					if (a['id'] > b['id']) return 1;
				} else {
					if (a['id'] < b['id']) return 1;
					if (a['id'] > b['id']) return -1;
				}
				return 0;
			}
		}
	}

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
		<div className='app d-flex flex-column' style={{ minHeight: '100vh' }}>
			<Navbar bg='dark' variant='dark'>
				<Container>
					<Navbar.Brand>
						<img
							src='moon-logo.png'
							width='30'
							height='30'
							alt='Moon Logo'
							className='d-inline-block align-top'
						/>&nbsp;
						Moonboard Guidebook</Navbar.Brand>
					<Nav defaultActiveKey='201640'>
						<Nav.Link onClick={() => { setQuery('mb_type=0') }} eventKey='201640'>2016 40°</Nav.Link>
						<Nav.Link onClick={() => { setQuery('mb_type=1') }} eventKey='201725'>2017 25°</Nav.Link>
						<Nav.Link onClick={() => { setQuery('mb_type=2') }} eventKey='201740'>2017 40°</Nav.Link>
						<Nav.Link onClick={() => { setQuery('mb_type=3') }} eventKey='201925'>2019 25°</Nav.Link>
						<Nav.Link onClick={() => { setQuery('mb_type=4') }} eventKey='201940'>2019 40°</Nav.Link>
						<Nav.Link onClick={() => { setQuery('mb_type=5') }} eventKey='202040'>2020 40°</Nav.Link>
					</Nav>
				</Container>
			</Navbar>

			<Container className='mt-4 mb-4'>
				<Form className='bg-light p-4 rounded'>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>Climb Name</Form.Label>
							<Form.Control type='name' placeHolder='Search for a climb' />
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Setter</Form.Label>
							<Form.Control type='setter' placeholder='Search for a setter' />
						</Form.Group>
					</Row>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>Grade</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='gradeMin' placeholder='Minimum' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='gradeMax' placeholder='Maximum' />
							</span>
							<Form.Text className='text-muted'>
								Format: V7 or 7A+
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Sandbag Score</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='sandbagMin' placeholder='Minimum' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='sandbagMax' placeholder='Maximum' />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Repeats</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='repeatsMin' placeholder='Minimum' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='repeatsMax' placeholder='Maximum' />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Stars</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='starsMin' placeholder='Minimum' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='starsMax' placeholder='Maximum' />
							</span>
						</Form.Group>
					</Row>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>Average Attempts</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='attemptsMin' placeholder='Minimum' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='attemptsMax' placeholder='Maximum' />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Date Created</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='dateMin' placeholder='Earliest' />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='dateMax' placeholder='Latest' />
							</span>
							<Form.Text className='text-muted'>
								Format: YYYY/MM/DD
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col} xs={6}>
							<Form.Label>Hold Sets</Form.Label>
							<div className='mb-3'>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='White Hold' src='white-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Black Hold' src='black-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Yellow Hold' src='yellow-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Red Hold' src='red-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Wooden A Hold' src='woodenA-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Wooden B Hold' src='woodenB-hold.png'></img>}
								/>
								<Form.Check
									inline
									defaultChecked
									label={<img alt='Wooden C Hold' src='woodenC-hold.png'></img>}
								/>
							</div>
						</Form.Group>
					</Row>

					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>Included Holds</Form.Label>
							<Form.Control type='name' placeHolder='All' />
							<Form.Text className='text-muted'>
								Example: A6, E13, D9
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Excluded Holds</Form.Label>
							<Form.Control type='setter' placeholder='None' />
							<Form.Text className='text-muted'>
								Example: J5, B16, C10
							</Form.Text>
						</Form.Group>
					</Row>

					<Row>
						<Col>
							<ToggleButton
								className='mb-2'
								id='toggle-check'
								type='checkbox'
								variant='outline-secondary'
								checked={open}
								onChange={(e) => setOpen(e.currentTarget.checked)}
							>
								Show Board Layout
							</ToggleButton>
							<Collapse in={open}>
								<div>
									<img src='2016.png' height='600px' alt='2016 Layout'></img>
								</div>
							</Collapse>
						</Col>
						<Col className="d-flex justify-content-end">
							<div>
							<Button variant='primary' type='submit'>
								Submit
							</Button>
							</div>
						</Col>
					</Row>
				</Form>
			</Container>

			<Container className='flex-1'>
				{error && <div>Error: {error}</div>}
				{loading && <div><center><Spinner animation='border' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</Spinner></center></div>}
				{data && (
					<><div><p>Found {data.length} benchmarks.</p></div>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Climb Name</u>
										{sort.column === 'name' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('setter')}>Setter</u>
										{sort.column === 'setter' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('grade')}>Grade</u>
										{sort.column === 'grade' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('sandbag')}>Sandbag Score</u>
										{sort.column === 'sandbag' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('repeats')}>Repeats</u>
										{sort.column === 'repeats' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('stars')}>Stars</u>
										{sort.column === 'stars' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('attempts')}>Average Attempts</u>
										{sort.column === 'attempts' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>Date Created</u>
										{sort.column === 'date' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										Hold Sets
									</th>
								</tr>
							</thead>
							<tbody>
								{data.map((row) => (
									<tr key={row.id}>
										<td>{row.name}</td>
										<td>{row.setter}</td>
										<td>{mapGrades[row.official_grade]}{row.upgraded ? ' \u2B06' : null} {row.downgraded ? ' \u2B07' : null}</td>
										<td style={{ color: row.user_grade > row.official_grade + 0.1 ? 'red' : row.user_grade < row.official_grade - 0.1 ? 'green' : 'black' }}>{Math.round((row.user_grade - row.official_grade) * 1000) / 100}</td>
										<td>{row.repeats}</td>
										<td>{row.user_stars}</td>
										<td>{row.user_attempts}</td>
										<td>{row.date_created.substring(0, 10).split('-').join('/')}</td>
										<td>
											{row.holdsets.includes(1) ? <img alt='White Hold' src='white-hold.png'></img> : null}
											{row.holdsets.includes(2) ? <img alt='Black Hold' src='black-hold.png'></img> : null}
											{row.holdsets.includes(0) ? <img alt='Yellow Hold' src='yellow-hold.png'></img> : null}
											{row.holdsets.includes(3) ? <img alt='Red Hold' src='red-hold.png'></img> : null}
											{row.holdsets.includes(4) ? <img alt='Wooden A Hold' src='woodenA-hold.png'></img> : null}
											{row.holdsets.includes(5) ? <img alt='Wooden B Hold' src='woodenB-hold.png'></img> : null}
											{row.holdsets.includes(6) ? <img alt='Wooden C Hold' src='woodenC-hold.png'></img> : null}
										</td>
									</tr>
								))}
							</tbody>
						</Table></>
				)}
			</Container>

			<ScrollToTop showUnder={600}>
				<img src='up-button.png' alt='UP' width='50' height='50' />
			</ScrollToTop>

			<footer className='footer mt-auto'>
				<Container className='pt-3'>
					<center>
						<p>© 2023 Simon Chase | <a href='https://github.com/smchase/Moonboard-Guidebook'>View on GitHub</a></p>
					</center>
				</Container>
			</footer>
		</div>
	);
}
