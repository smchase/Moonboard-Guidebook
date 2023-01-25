import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Nav, Navbar, Button, Spinner, Form, ToggleButton, Collapse, Row, Col, Modal, Tooltip, OverlayTrigger, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp, faArrowDown, faCircleUp, faCircleDown, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import './App.css';



export default function App() {
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
	};
	const urlGradeMap = {
		0: '5%2B+V2',
		1: '6A+V3',
		2: '6A%2B+V3',
		3: '6B+V4',
		4: '6B%2B+V4',
		5: '6C+V5',
		6: '6C%2B+V5',
		7: '7A+V6',
		8: '7A%2B+V7',
		9: '7B+V8',
		10: '7B%2B+V8',
		11: '7C+V9',
		12: '7C%2B+V10',
		13: '8A+V11',
		14: '8A%2B+V12',
		15: '8B+V13',
		16: '8B%2B+V14',
		17: '8C+V15',
	};

	const [data, setData] = useState(null);
	const [loadingData, setLoadingData] = useState(true);
	const [errorLoadingData, setErrorLoadingData] = useState(null);
	const [showLayout, setShowLayout] = useState(false); // 
	const [sort, setSort] = useState({ column: 'date_created', order: 'asc' });
	const [mbtype, setMbtype] = useState(0);
	const [filter, setFilter] = useState({
		name: '',
		setter: '',
		gradeMin: 0,
		gradeMax: 17,
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
		logbook: 0
	});
	const [showPopup, setShowPopup] = useState(false);
	const [popupClimb, setPopupClimb] = useState({ name: '', grade: 0 });
	const closePopup = () => setShowPopup(false);
	const openPopup = (row) => {
		setShowPopup(true);
		setPopupClimb(row);
	}
	const [showLogin, setShowLogin] = useState(false);
	const closeLogin = () => {
		setShowLogin(false);
		setLoginErr(false);
	};
	const canvasRef = useRef(null);

	useEffect(() => {
		const urlBase = 'http://192.168.0.2:3001/benchmarks/mb_type/';
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

	// render mb
	useEffect(() => {
		if (!showPopup) {
			return;
		}
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let x = 0; x < 11; x++) {
			const xMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
			if (mbtype !== 5) {
				for (let y = 0; y < 18; y++) {
					const yPos = 18 - y;
					if (popupClimb.start_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'limegreen';
						ctx.stroke();
					}
					if (popupClimb.mid_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'blue';
						ctx.stroke();
					}
					if (popupClimb.end_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'red';
						ctx.stroke();
					}
				}
			} else {
				for (let y = 0; y < 12; y++) {
					const yPos = 12 - y;
					if (popupClimb.start_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'limegreen';
						ctx.stroke();
					}
					if (popupClimb.mid_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'blue';
						ctx.stroke();
					}
					if (popupClimb.end_holds.includes(xMap[x] + yPos)) {
						ctx.beginPath();
						ctx.lineWidth = 4;
						ctx.arc(65 + x * 34.6, 60 + y * 34.6, 18, 0, 2 * Math.PI);
						ctx.strokeStyle = 'red';
						ctx.stroke();
					}
				}
			}
		}
	}, [showPopup, mbtype, popupClimb]);

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
		if (filter.gradeMin > row.grade) return false;
		if (filter.gradeMax < row.grade) return false;
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
			const included_holds = filter.included.toUpperCase().trim().replace(/^[,.;]+|[,.;]+$/g, '').split(/[,.;\s]+/);
			for (let i = 0; i < included_holds.length; i++) {
				if (!(row.start_holds.includes(included_holds[i]) || row.mid_holds.includes(included_holds[i]) || row.end_holds.includes(included_holds[i]))) return false;
			}
		}
		if (filter.excluded) {
			const excluded_holds = filter.excluded.toUpperCase().trim().replace(/^[,.;]+|[,.;]+$/g, '').split(/[,.;\s]+/);
			for (let i = 0; i < excluded_holds.length; i++) {
				if (row.start_holds.includes(excluded_holds[i]) || row.mid_holds.includes(excluded_holds[i]) || row.end_holds.includes(excluded_holds[i])) return false;
			}
		}
		if (logbook) {
			if (filter.logbook === 1) {
				if (logbook.includes(row.id)) return false;
			} else if (filter.logbook === 2) {
				if (!logbook.includes(row.id)) return false;
			}
		}
		return true;
	}

	const handleNext = () => {
		const tableData = data.filter(row => filterRow(row));
		if (tableData[tableData.length - 1].id === popupClimb.id) return;
		for (let i = 0; i < tableData.length; i++) {
			if (tableData[i].id === popupClimb.id) {
				setPopupClimb(tableData[i + 1]);
				break;
			}
		}
	};

	const handlePrevious = () => {
		const tableData = data.filter(row => filterRow(row));
		if (tableData[0].id === popupClimb.id) return;
		for (let i = 0; i < tableData.length; i++) {
			if (tableData[i].id === popupClimb.id) {
				setPopupClimb(tableData[i - 1]);
				break;
			}
		}
	};

	const [logbook, setLogbook] = useState(null);
	const [username, setUsername] = useState(null);
	const [loginErr, setLoginErr] = useState(null);
	function submitLogin(e) {
		e.preventDefault();
		setUsername(e.target.username.value);
		axios({
			method: 'get',
			url: 'http://192.168.0.2:3001/getlogbook',
			params: {
				username: e.target.username.value,
				password: e.target.password.value
			}
		}).then(result => {
			setLogbook(result.data);
			setShowLogin(false);
			setLoginErr(false);
		}).catch(err => {
			setLoginErr(true);
		});
	}

	return (
		<div className='app d-flex flex-column' style={{ minHeight: '100vh' }}>
			{/* Navbar */}
			<Navbar bg='dark' collapseOnSelect variant='dark' expand='lg'>
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
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
						<Nav defaultActiveKey={mbtype}>
							<Nav.Link onClick={() => setMbtype(0)} eventKey='0'>2016 40°</Nav.Link>
							<Nav.Link onClick={() => setMbtype(1)} eventKey='1'>2017 25°</Nav.Link>
							<Nav.Link onClick={() => setMbtype(2)} eventKey='2'>2017 40°</Nav.Link>
							<Nav.Link onClick={() => setMbtype(3)} eventKey='3'>2019 25°</Nav.Link>
							<Nav.Link onClick={() => setMbtype(4)} eventKey='4'>2019 40°</Nav.Link>
							<Nav.Link onClick={() => setMbtype(5)} eventKey='5'>2020 40°</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			{/* Filters */}
			<Container className='mt-4 mb-4'>
				<Form className='bg-light p-4 rounded'>
					<Row>
						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>Climb Name</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })} />
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>Setter</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.setter} onChange={(e) => setFilter({ ...filter, setter: e.target.value })} />
						</Form.Group>
					</Row>
					<Row>
						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Grade
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Font or V Grade</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>

							<span className='d-flex flex-row'>
								<Form.Select value={filter.gradeMin} onChange={(e) => setFilter({ ...filter, gradeMin: e.target.value })}>
									{Object.values(mapGrades).map((grade, index) => (
										<option value={index}>{grade}</option>
									))}
								</Form.Select>
								<span className='my-auto mx-2'>to</span>
								<Form.Select value={filter.gradeMax} onChange={(e) => setFilter({ ...filter, gradeMax: e.target.value })}>
									{Object.values(mapGrades).map((grade, index) => (
										<option value={index}>{grade}</option>
									))}
								</Form.Select>
							</span>
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Sandbag Score
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Based on user grades, negative means soft, positive means hard</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.sandbagMin} onChange={(e) => setFilter({ ...filter, sandbagMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.sandbagMax} onChange={(e) => setFilter({ ...filter, sandbagMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Repeats
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Number of users who have logged a send</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.repeatsMin} onChange={(e) => setFilter({ ...filter, repeatsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.repeatsMax} onChange={(e) => setFilter({ ...filter, repeatsMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Stars
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Average user star rating</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.starsMin} onChange={(e) => setFilter({ ...filter, starsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.starsMax} onChange={(e) => setFilter({ ...filter, starsMax: e.target.value })} />
							</span>
						</Form.Group>
					</Row>
					<Row>
						<Form.Group as={Col} md={3} className='mb-3'>
							<Form.Label>
								Average Attempts
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Calculations count 'more than 3 tries' as 4</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Minimum' value={filter.attemptsMin} onChange={(e) => setFilter({ ...filter, attemptsMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Maximum' value={filter.attemptsMax} onChange={(e) => setFilter({ ...filter, attemptsMax: e.target.value })} />
							</span>
						</Form.Group>


						<Form.Group as={Col} md={3} className='mb-3'>
							<Form.Label>
								Date Created
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>YYYY/MM/DD</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<span className='d-flex flex-row'>
								<Form.Control type='text' placeholder='Earliest' value={filter.dateMin} onChange={(e) => setFilter({ ...filter, dateMin: e.target.value })} />
								<span className='my-auto mx-2'>to</span>
								<Form.Control type='text' placeholder='Latest' value={filter.dateMax} onChange={(e) => setFilter({ ...filter, dateMax: e.target.value })} />
							</span>
						</Form.Group>

						<Form.Group as={Col} md={6} className='mb-3'>
							<Form.Label>
								Hold Sets
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Which hold sets climbs can use, hover over holds below for names</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<div>
								<Form.Check
									inline
									defaultChecked
									value={filter.hsa}
									onChange={(e) => setFilter({ ...filter, hsa: e.target.checked })}
									label={<OverlayTrigger
										placement='right'
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
										placement='right'
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
										placement='right'
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
										placement='right'
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
										placement='right'
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
										placement='right'
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
										placement='right'
										delay={{ show: 250, hide: 400 }}
										overlay={<Tooltip>Wood Holds C</Tooltip>}
									>
										<img alt='Wood Hold C' src='woodenC-hold.png'></img>
									</OverlayTrigger>}
								/>
							</div>
						</Form.Group>
					</Row>

					<Row>
						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Included Holds
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<Form.Control type='text' placeholder='All' value={filter.included} onChange={(e) => setFilter({ ...filter, included: e.target.value })} />
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Excluded Holds
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<Form.Control type='text' placeholder='None' value={filter.excluded} onChange={(e) => setFilter({ ...filter, excluded: e.target.value })} />
						</Form.Group>

						<Form.Group as={Col} md className='mb-3'>
							<Form.Label>
								Logbook Status
								<OverlayTrigger
									placement='right'
									delay={{ show: 250, hide: 400 }}
									overlay={<Tooltip>You have to load your logbook to use this</Tooltip>}
								>
									<FontAwesomeIcon className='mx-1' style={{ color: 'grey' }} icon={faCircleQuestion} />
								</OverlayTrigger>
							</Form.Label>
							<Form.Select value={filter.logbook} disabled={!logbook} onChange={(e) => setFilter({ ...filter, logbook: e.target.value })}>
								<option value={0}>Any</option>
								<option value={1}>Exclude my repeats</option>
								<option value={2}>My repeats only</option>
							</Form.Select>
						</Form.Group>
					</Row>

					<Row className='mt-1'>
						<Col>
							<ToggleButton
								id='toggle-check'
								type='checkbox'
								variant='outline-secondary'
								checked={showLayout}
								onChange={(e) => setShowLayout(e.currentTarget.checked)}
							>
								Show Board Layout
							</ToggleButton>
						</Col>
						<Col className='ml-auto d-flex justify-content-end'>
							<Button variant="primary" onClick={() => setShowLogin(true)}>
								Load Logbook
							</Button>
						</Col>
					</Row>

					<Row>
						<Collapse in={showLayout}>
							<div>
								<img src={
									mbtype === 0 ? '2016.png' : ((mbtype === 1 || mbtype === 2) ? '2017.png' : ((mbtype === 3 || mbtype === 4) ? '2019.png' : '2020.png'))
								} alt={
									mbtype === 0 ? '2016 Layout' : ((mbtype === 1 || mbtype === 2) ? '2017 Layout' : ((mbtype === 3 || mbtype === 4) ? '2019 Layout' : '2020 Layout'))
								} className='mt-2' style={{ maxWidth: '100%' }}></img>
							</div>
						</Collapse>
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
					<><div><p>Found {data.filter(row => filterRow(row)).length} benchmark{data.filter(row => filterRow(row)).length === 1 ? null : 's'}.{logbook ? ` Logbook loaded from ${username}.` : ' No logbook loaded.'}</p></div>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									{logbook ? <th>Sent</th> : null}
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>Climb Name</u>
										{sort.column === 'name' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('setter')}>Setter</u>
										{sort.column === 'setter' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('grade')}>Grade</u>
										{sort.column === 'grade' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('sandbag_score')}>Sandbag Score</u>
										{sort.column === 'sandbag_score' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('repeats')}>Repeats</u>
										{sort.column === 'repeats' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('avg_user_stars')}>Stars</u>
										{sort.column === 'avg_user_stars' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('avg_user_attempts')}>Average Attempts</u>
										{sort.column === 'avg_user_attempts' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										<u style={{ cursor: 'pointer' }} onClick={() => handleSort('date_created')}>Date Created</u>
										{sort.column === 'date_created' ? (sort.order === 'asc' ? <FontAwesomeIcon className='mx-1' icon={faArrowDown} /> : <FontAwesomeIcon className='mx-1' icon={faArrowUp} />) : null}
									</th>
									<th>
										Hold Sets
									</th>
								</tr>
							</thead>
							<tbody>
								{data.filter(row => filterRow(row)).map((row) => (
									<tr key={row.id}>
										{logbook ? <td><FontAwesomeIcon style={{ color: logbook.includes(row.id) ? 'green' : 'red' }} icon={logbook.includes(row.id) ? faCheck : faX}></FontAwesomeIcon></td> : null}
										<td><u style={{ cursor: 'pointer' }} onClick={() => openPopup(row)}>{row.name}</u></td>
										<td>{row.setter}</td>
										<td>{mapGrades[row.grade]}{' '}{row.upgraded ? <FontAwesomeIcon icon={faCircleUp}></FontAwesomeIcon> : null} {row.downgraded ? <FontAwesomeIcon icon={faCircleDown}></FontAwesomeIcon> : null}</td>
										<td style={{ color: row.sandbag_score > 1 ? 'red' : row.sandbag_score < -1 ? 'green' : 'black' }}>{Math.round(row.sandbag_score * 1000) / 1000}</td>
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

			{/* Climb Popup */}
			<Modal show={showPopup} onHide={closePopup}>
				<Modal.Header closeButton>
					<Modal.Title>{popupClimb.name}, {mapGrades[popupClimb.grade]}</Modal.Title>
				</Modal.Header>
				<Modal.Body >
					<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						<canvas ref={canvasRef} id='circles-canvas' style={{ maxWidth: '100%', background: `url(${mbtype === 0 ? '2016.png' : ((mbtype === 1 || mbtype === 2) ? '2017.png' : ((mbtype === 3 || mbtype === 4) ? '2019.png' : '2020.png'))})`, backgroundSize: '100%' }} width='450' height={mbtype === 5 ? 485 : 692} />
					</div>
				</Modal.Body>
				<Modal.Footer className='d-flex justify-content-between'>
					<Button variant="secondary" onClick={handlePrevious}>Previous</Button>
							<a href={
								'https://www.youtube.com/results?search_query=' +
								popupClimb.name.replace(/ /g, '+') + '+' +
								urlGradeMap[popupClimb.grade] +
								'+moonboard+benchmark'
							} target="_blank" rel="noopener noreferrer"><Button variant='outline-primary'><FontAwesomeIcon icon={faYoutube}/> Find Beta Videos</Button></a>
					<Button variant="secondary" onClick={handleNext}>Next</Button>
				</Modal.Footer>
			</Modal>

			{/* Login window */}
			<Modal show={showLogin} onHide={closeLogin}>
				<Modal.Header closeButton>
					<Modal.Title>Moonboard Account Login</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={submitLogin}>
						<Alert variant='warning'>
							We won't do anything bad with your login, but we can't guarantee security, so use at your own risk.
						</Alert>

						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder="ravioli_biceps" name='username' />
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="password123" name='password' />
						</Form.Group>

						<div className="d-grid gap-2">
							<Button variant="primary" type='submit'>
								Submit
							</Button>
						</div>

						{loginErr ? <div className='mt-2'><Form.Text style={{ color: 'red' }}>Error fetching logbook, please check your login info and try again.</Form.Text></div> : null}
					</Form>
				</Modal.Body>
			</Modal>

			{/* Footer */}
			<footer className='footer mt-auto'>
				<Container className='pt-3'>
					<center>
						<p>© 2023 Simon Chase | <a href='https://github.com/smchase/Moonboard-Guidebook'>View on GitHub</a></p>
					</center>
				</Container>
			</footer>
		</div >
	);
}
