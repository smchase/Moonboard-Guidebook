import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Nav, Navbar, Spinner, Form, ToggleButton, Collapse, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ScrollToTop from 'react-scroll-up';

export default function App() {
	const [data, setData] = useState(null);
	const [loadingData, setLoadingData] = useState(true);
	const [errorLoadingData, setErrorLoadingData] = useState(null);
	const [showLayout, setShowLayout] = useState(false); // 
	const [sort, setSort] = useState({ column: 'date_created', order: 'asc' });
	const [mbtype, setMbtype] = useState(0);
	const [filter, setFilter] = useState({
		name: '',
		setter: '',
		gradeMin: '',
		gradeMax: '',
		sandbagMin: '',
		sandbagMax: '',
		repeatsMin: '',
		repeatsMax: '',
		starsMin: '',
		starsMax: '',
		attemptsMin: '',
		attemptsMax: '',
		dateMin: '',
		dateMax: '',
		hsa: true,
		hsb: true,
		hsc: true,
		osh: true,
		wha: true,
		whb: true,
		whc: true,
		included: '',
		excluded: '',
	});

	const urlBase = 'http://localhost:3001/benchmarks/mb_type/';
	useEffect(() => {
		setLoadingData(true);
		setSort({ column: null, order: null });
		const getData = async () => {
			try {
				const response = await axios.get(urlBase + mbtype);
				setData(response.data);
				setErrorLoadingData(null);
			} catch (err) {
				setErrorLoadingData(err.message);
				setData(null);
			} finally {
				setLoadingData(false);
			}
		}
		getData();
	}, [mbtype]);

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
					if (a['grade'] < b['grade']) return -1;
					if (a['grade'] > b['grade']) return 1;
					if (a['avg_user_grade'] < b['avg_user_grade']) return -1;
					if (a['avg_user_grade'] > b['avg_user_grade']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['grade'] < b['grade']) return 1;
					if (a['grade'] > b['grade']) return -1;
					if (a['avg_user_grade'] < b['avg_user_grade']) return 1;
					if (a['avg_user_grade'] > b['avg_user_grade']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'sandbag_score') {
				if (order === 'asc') {
					if (a['sandbag_score'] < b['sandbag_score']) return -1;
					if (a['sandbag_score'] > b['sandbag_score']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['sandbag_score'] < b['sandbag_score']) return 1;
					if (a['sandbag_score'] > b['sandbag_score']) return -1;
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
			} else if (column === 'avg_user_stars') {
				if (order === 'asc') {
					if (a['avg_user_stars'] < b['avg_user_stars']) return -1;
					if (a['avg_user_stars'] > b['avg_user_stars']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['avg_user_stars'] < b['avg_user_stars']) return 1;
					if (a['avg_user_stars'] > b['avg_user_stars']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'avg_user_attempts') {
				if (order === 'asc') {
					if (a['avg_user_attempts'] < b['avg_user_attempts']) return -1;
					if (a['avg_user_attempts'] > b['avg_user_attempts']) return 1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return -1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return 1;
				} else {
					if (a['avg_user_attempts'] < b['avg_user_attempts']) return 1;
					if (a['avg_user_attempts'] > b['avg_user_attempts']) return -1;
					if (a['name'].toLowerCase() < b['name'].toLowerCase()) return 1;
					if (a['name'].toLowerCase() > b['name'].toLowerCase()) return -1;
				}
				return 0;
			} else if (column === 'date_created') {
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
	function filterRow(row) {
		if (filter.name && row.name.toLowerCase().indexOf(filter.name.toLowerCase()) === -1) return false;
		if (filter.setter && row.setter.toLowerCase().indexOf(filter.setter.toLowerCase()) === -1) return false;
		if (filter.gradeMin) {
			const minMap = {
				'5+': 0,
				'6A': 1,
				'6A+': 2,
				'6B': 3,
				'6B+': 4,
				'6C': 5,
				'6C+': 6,
				'7A': 7,
				'7A+': 8,
				'7B': 9,
				'7B+': 10,
				'7C': 11,
				'7C+': 12,
				'8A': 13,
				'8A+': 14,
				'8B': 15,
				'8B+': 16,
				'8C': 17,
				'V0': 0,
				'V1': 0,
				'V2': 0,
				'V3': 1,
				'V4': 3,
				'V5': 5,
				'V6': 7,
				'V7': 8,
				'V8': 9,
				'V9': 11,
				'V10': 12,
				'V11': 13,
				'V12': 14,
				'V13': 15,
				'V14': 16,
				'V15': 17,
			}
			if (minMap[filter.gradeMin.toUpperCase()] > row.grade) return false;
		}
		if (filter.gradeMax) {
			const maxMap = {
				'5+': 0,
				'6A': 1,
				'6A+': 2,
				'6B': 3,
				'6B+': 4,
				'6C': 5,
				'6C+': 6,
				'7A': 7,
				'7A+': 8,
				'7B': 9,
				'7B+': 10,
				'7C': 11,
				'7C+': 12,
				'8A': 13,
				'8A+': 14,
				'8B': 15,
				'8B+': 16,
				'8C': 17,
				'V0': -1,
				'V1': -1,
				'V2': 0,
				'V3': 2,
				'V4': 4,
				'V5': 6,
				'V6': 7,
				'V7': 8,
				'V8': 10,
				'V9': 11,
				'V10': 12,
				'V11': 13,
				'V12': 14,
				'V13': 15,
				'V14': 16,
				'V15': 17,
			}
			if (maxMap[filter.gradeMax.toUpperCase()] < row.grade) return false;
		}
		if (filter.sandbagMin && filter.sandbagMin > row.sandbag_score) return false;
		if (filter.sandbagMax && filter.sandbagMax < row.sandbag_score) return false;
		if (filter.repeatsMin && filter.repeatsMin > row.repeats) return false;
		if (filter.repeatsMax && filter.repeatsMax < row.repeats) return false;
		if (filter.starsMin && filter.starsMin > row.avg_user_stars) return false;
		if (filter.starsMax && filter.starsMax < row.avg_user_stars) return false;
		if (filter.attemptsMin && filter.attemptsMin > row.avg_user_attempts) return false;
		if (filter.attemptsMax && filter.attemptsMax < row.avg_user_attempts) return false;
		if (filter.dateMin && filter.dateMin > row.date_created.substring(0, 10).split('-').join('/')) return false;
		if (filter.dateMax && filter.dateMax < row.date_created.substring(0, 10).split('-').join('/')) return false;
		if (!filter.osh && row.holdsets.includes(0)) return false;
		if (!filter.hsa && row.holdsets.includes(1)) return false;
		if (!filter.hsb && row.holdsets.includes(2)) return false;
		if (!filter.hsc && row.holdsets.includes(3)) return false;
		if (!filter.wha && row.holdsets.includes(4)) return false;
		if (!filter.whb && row.holdsets.includes(5)) return false;
		if (!filter.whc && row.holdsets.includes(6)) return false;
		if (filter.included) {
			const included_holds = filter.included.toUpperCase().trim().replace(/^[,.;]+|[,.;]+$/g, "").split(/[,.;\s]+/);
			for (let i = 0; i < included_holds.length; i++) {
				if (!(row.start_holds.includes(included_holds[i]) || row.mid_holds.includes(included_holds[i]) || row.end_holds.includes(included_holds[i]))) return false;
			}
		}
		if (filter.excluded) {
			const excluded_holds = filter.excluded.toUpperCase().trim().replace(/^[,.;]+|[,.;]+$/g, "").split(/[,.;\s]+/);
			for (let i = 0; i < excluded_holds.length; i++) {
				if (row.start_holds.includes(excluded_holds[i]) || row.mid_holds.includes(excluded_holds[i]) || row.end_holds.includes(excluded_holds[i])) return false;
			}
		}
		return true;
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
			{/* Navbar */}
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
						<Nav.Link onClick={() => { setMbtype(0) }} eventKey='201640'>2016 40°</Nav.Link>
						<Nav.Link onClick={() => { setMbtype(1) }} eventKey='201725'>2017 25°</Nav.Link>
						<Nav.Link onClick={() => { setMbtype(2) }} eventKey='201740'>2017 40°</Nav.Link>
						<Nav.Link onClick={() => { setMbtype(3) }} eventKey='201925'>2019 25°</Nav.Link>
						<Nav.Link onClick={() => { setMbtype(4) }} eventKey='201940'>2019 40°</Nav.Link>
						<Nav.Link onClick={() => { setMbtype(5) }} eventKey='202040'>2020 40°</Nav.Link>
					</Nav>
				</Container>
			</Navbar>

			{/* Filter */}
			<Container className='mt-4 mb-4'>
				<Form className='bg-light p-4 rounded'>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>Climb Name</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>Setter</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.setter} onChange={(e) => setFilter({ ...filter, setter: e.target.value })} />
						</Form.Group>
					</Row>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>
								Grade
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Font or V Grade</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>

							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.gradeMin} onChange={(e) => setFilter({ ...filter, gradeMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.gradeMax} onChange={(e) => setFilter({ ...filter, gradeMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>
								Sandbag Score
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Based on user grades, negative means soft, positive means hard</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.sandbagMin} onChange={(e) => setFilter({ ...filter, sandbagMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.sandbagMax} onChange={(e) => setFilter({ ...filter, sandbagMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>
								Repeats
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Number of users who have logged a send</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.repeatsMin} onChange={(e) => setFilter({ ...filter, repeatsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.repeatsMax} onChange={(e) => setFilter({ ...filter, repeatsMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>
								Stars
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Average user star rating</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.starsMin} onChange={(e) => setFilter({ ...filter, starsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.starsMax} onChange={(e) => setFilter({ ...filter, starsMax: e.target.value })} />
							</span>
						</Form.Group>
					</Row>
					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>
								Average Attempts
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Calculations count "more than 3 tries" as 4</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.attemptsMin} onChange={(e) => setFilter({ ...filter, attemptsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.attemptsMax} onChange={(e) => setFilter({ ...filter, attemptsMax: e.target.value })} />
							</span>
						</Form.Group>


						<Form.Group as={Col}>
							<Form.Label>
								Date Created
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>YYYY/MM/DD</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Earliest' value={filter.dateMin} onChange={(e) => setFilter({ ...filter, dateMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Latest' value={filter.dateMax} onChange={(e) => setFilter({ ...filter, dateMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col} xs={6}>
							<Form.Label>
								Hold Sets
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Which hold sets climbs can include</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<div className='mb-3'>
								<Form.Check
									inline
									defaultChecked
									value={filter.hsa}
									onChange={(e) => setFilter({ ...filter, hsa: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Hold Set A</Tooltip>}
									>
										<img alt='White Hold' src='white-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.hsb}
									onChange={(e) => setFilter({ ...filter, hsb: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Hold Set B</Tooltip>}
									>
										<img alt='Black Hold' src='black-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.osh}
									onChange={(e) => setFilter({ ...filter, osh: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Original School Holds</Tooltip>}
									>
										<img alt='Yellow Hold' src='yellow-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.hsc}
									onChange={(e) => setFilter({ ...filter, hsc: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Hold Set C</Tooltip>}
									>
										<img alt='Red Hold' src='red-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.wha}
									onChange={(e) => setFilter({ ...filter, wha: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Wood Holds A</Tooltip>}
									>
										<img alt='Wood Hold A' src='woodenA-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.whb}
									onChange={(e) => setFilter({ ...filter, whb: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Wood Holds B</Tooltip>}
									>
										<img alt='Wood Hold B' src='woodenB-hold.png'></img>
									</OverlayTrigger>}
								/>
								<Form.Check
									inline
									defaultChecked
									value={filter.whc}
									onChange={(e) => setFilter({ ...filter, whc: e.target.checked })}
									label={<OverlayTrigger
										placement="right"
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Wood Holds C</Tooltip>}
									>
										<img alt='Wood Hold C' src='woodenC-hold.png'></img>
									</OverlayTrigger>}
								/>
							</div>
						</Form.Group>
					</Row>

					<Row className='mb-3'>
						<Form.Group as={Col}>
							<Form.Label>
								Included Holds
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.included} onChange={(e) => setFilter({ ...filter, included: e.target.value })} />
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Label>
								Excluded Holds
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
								>
									<img src='info.png' width='15' alt='Info' className='mx-1 mb-1' />
								</OverlayTrigger>
							</Form.Label>
							<Form.Control type='text' placeholder='None' value={filter.excluded} onChange={(e) => setFilter({ ...filter, excluded: e.target.value })} />
						</Form.Group>
					</Row>

					<Row>
						<Col>
							<ToggleButton
								className='mb-2'
								id='toggle-check'
								type='checkbox'
								variant='outline-secondary'
								checked={showLayout}
								onChange={(e) => setShowLayout(e.currentTarget.checked)}
							>
								Show Board Layout
							</ToggleButton>
							<Collapse in={showLayout}>
								<div>
									<img src={
										mbtype === 0 ? '2016.png' : ((mbtype === 1 || mbtype === 2) ? '2017.png' : ((mbtype === 3 || mbtype === 4) ? '2019.png' : '2020.png'))
									} alt='2016 Layout'></img>
								</div>
							</Collapse>
						</Col>
						<Col className='d-flex justify-content-end'>
							<div className='align-self-end'>
								<Form.Text className="text-muted">
									Start typing to filter.
								</Form.Text>
							</div>
						</Col>
					</Row>
				</Form>
			</Container>

			{/* Table */}
			<Container className='flex-1'>
				{errorLoadingData && <div>Error: {errorLoadingData}</div>}
				{loadingData && <div><center><Spinner animation='border' role='status'>
					<span className='visually-hidden'>Loading...</span>
				</Spinner></center></div>}
				{data && (
					<><div><p>Found {data.filter(row => filterRow(row)).length} benchmarks.</p></div>
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
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('sandbag_score')}>Sandbag Score</u>
										{sort.column === 'sandbag_score' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('repeats')}>Repeats</u>
										{sort.column === 'repeats' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('avg_user_stars')}>Stars</u>
										{sort.column === 'avg_user_stars' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('avg_user_attempts')}>Average Attempts</u>
										{sort.column === 'avg_user_attempts' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('date_created')}>Date Created</u>
										{sort.column === 'date_created' ? (sort.order === 'asc' ? ' \u2193' : ' \u2191') : null}
									</th>
									<th>
										Hold Sets
									</th>
								</tr>
							</thead>
							<tbody>
								{data.filter(row => filterRow(row)).map((row) => (
									<tr key={row.id}>
										<td>{row.name}</td>
										<td>{row.setter}</td>
										<td>{mapGrades[row.grade]}{row.upgraded ? ' \u2B06' : null} {row.downgraded ? ' \u2B07' : null}</td>
										<td style={{ color: row.sandbag_score > 1 ? 'red' : row.sandbag_score < 1 ? 'green' : 'black' }}>{Math.round(row.sandbag_score * 1000) / 1000}</td>
										<td>{row.repeats}</td>
										<td>{row.avg_user_stars}</td>
										<td>{row.avg_user_attempts}</td>
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
