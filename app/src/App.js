import { useState, useEffect, useRef } from "react"
import { Table, Container, Nav, Navbar, Button, Spinner, Form, ToggleButton, Collapse, Row, Col, Modal, Tooltip, OverlayTrigger } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons"
import { faArrowUp, faArrowDown, faCircleUp, faCircleDown } from "@fortawesome/free-solid-svg-icons"
import { faYoutube } from "@fortawesome/free-brands-svg-icons"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css"

export default function App() {
  // Initial filter state object
  const initialFilterState = {
    climbName: "",
    setter: "",
    gradeMin: 0,
    gradeMax: 16,
    sandbagMin: "",
    sandbagMax: "",
    repeatsMin: "",
    repeatsMax: "",
    starsMin: "",
    starsMax: "",
    attemptsMin: "",
    attemptsMax: "",
    dateMin: null,
    dateMax: null,
    hsa: true,
    hsb: true,
    hsc: true,
    osh: true,
    wha: true,
    whb: true,
    whc: true,
    included: "",
    excluded: ""
  }

  // Core application state
  const [mbtype, setMbtype] = useState(0)
  const [data, setData] = useState(null)
  const [sort, setSort] = useState({ column: "date_created", order: "asc" })
  const [filter, setFilter] = useState(initialFilterState)
  const [popupClimb, setPopupClimb] = useState({ name: "", grade: 0 })

  // UI state
  const [loadingData, setLoadingData] = useState(true)
  const [errorLoadingData, setErrorLoadingData] = useState(null)
  const [showLayout, setShowLayout] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Grade mapping for display
  const gradeMap = {
    0: "5+ (V1)",
    1: "6A (V2)",
    2: "6A+ (V3)",
    3: "6B (V4)",
    4: "6B+ (V4)",
    5: "6C (V5)",
    6: "6C+ (V5)",
    7: "7A (V6)",
    8: "7A+ (V7)",
    9: "7B (V8)",
    10: "7B+ (V8)",
    11: "7C (V9)",
    12: "7C+ (V10)",
    13: "8A (V11)",
    14: "8A+ (V12)",
    15: "8B (V13)",
    16: "8B+ (V14)",
  }

  // Data fetching and initialization
  useEffect(() => {
    setLoadingData(true);
    fetch('/benchmarks.json')
      .then(response => response.json())
      .then(benchmarks => {
        const filteredData = benchmarks
          .filter(climb => climb.mb_type === mbtype)
          .map(climb => ({
            ...climb,
            date_created: new Date(climb.date_created)
          }));
        setData(filteredData);
        setErrorLoadingData(null);
      })
      .catch(err => {
        setErrorLoadingData(err.message);
        setData(null);
      })
      .finally(() => {
        setLoadingData(false);
      });
    setSort({ column: "date_created", order: "asc" });
  }, [mbtype]);

  // Canvas rendering for climb visualization
  useEffect(() => {
    if (!showPopup) {
      return
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = 0; x < 11; x++) {
      const xMap = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
      for (let y = 0; y < (mbtype === 5 ? 12 : 18); y++) {
        const yPos = (mbtype === 5 ? 12 : 18) - y
        if (popupClimb.start_holds.includes(xMap[x] + yPos) || popupClimb.mid_holds.includes(xMap[x] + yPos) || popupClimb.end_holds.includes(xMap[x] + yPos)) {
          if (popupClimb.start_holds.includes(xMap[x] + yPos)) {
            ctx.strokeStyle = "limegreen"
          } else if (popupClimb.mid_holds.includes(xMap[x] + yPos)) {
            ctx.strokeStyle = "blue"
          } else {
            ctx.strokeStyle = "red"
          }
          ctx.beginPath()
          ctx.lineWidth = 4
          ctx.arc(65 + x * 34.6, 60 + y * 34.6, 20, 0, 2 * Math.PI)
          ctx.stroke()
        }
      }
    }
  }, [showPopup, mbtype, popupClimb])

  // sort data
  const handleSort = (column) => {
    const order = sort.column === column && sort.order === "asc" ? "desc" : "asc"
    setSort({ column, order })
    data.sort(compare(column, order))
  }
  const compare = (column, order) => {
    return (a, b) => {
      let valA = column === "date_created" ? a["id"] : a[column]
      let valB = column === "date_created" ? b["id"] : b[column]
      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }
      if (valA < valB) return order === "asc" ? -1 : 1
      if (valA > valB) return order === "asc" ? 1 : -1

      // valA = valB at this point
      if (column === "grade") {
        valA = a["avg_user_grade"]
        valB = b["avg_user_grade"]
        if (valA < valB) return order === "asc" ? -1 : 1
        if (valA > valB) return order === "asc" ? 1 : -1
      }
      valA = a["name"]
      valB = b["name"]
      if (valA < valB) return order === "asc" ? -1 : 1
      if (valA > valB) return order === "asc" ? 1 : -1

      return 0
    }
  }

  // Simplify filter functions
  const filterHolds = (holds, row) => {
    if (!holds) return true
    const holdList = holds.toUpperCase().trim().replace(/^[,.]+|[,.]+$/g, "").split(/[,.\s]+/)
    return holdList.every(hold => 
      row.start_holds.includes(hold) || 
      row.mid_holds.includes(hold) || 
      row.end_holds.includes(hold)
    )
  }

  const filterExcludedHolds = (holds, row) => {
    if (!holds) return true
    const holdList = holds.toUpperCase().trim().replace(/^[,.]+|[,.]+$/g, "").split(/[,.\s]+/)
    return !holdList.some(hold => 
      row.start_holds.includes(hold) || 
      row.mid_holds.includes(hold) || 
      row.end_holds.includes(hold)
    )
  }

  // true if keep row, false if hide it
  const filterRow = (row) => {
    // Basic filters
    if (filter.climbName && !row.name.toLowerCase().includes(filter.climbName.toLowerCase())) return false
    if (filter.setter && !row.setter.toLowerCase().includes(filter.setter.toLowerCase())) return false
    if (filter.gradeMin > row.grade || filter.gradeMax < row.grade) return false
    
    // Numeric range filters
    const numericFilters = [
      { min: filter.sandbagMin, max: filter.sandbagMax, value: row.sandbag_score },
      { min: filter.repeatsMin, max: filter.repeatsMax, value: row.repeats },
      { min: filter.starsMin, max: filter.starsMax, value: row.avg_user_stars },
      { min: filter.attemptsMin, max: filter.attemptsMax, value: row.avg_user_attempts }
    ]
    
    if (numericFilters.some(({ min, max, value }) => 
      (min && min > value) || (max && max < value)
    )) return false

    // Date filters
    if (filter.dateMin && filter.dateMin > row.date_created) return false
    if (filter.dateMax && filter.dateMax < row.date_created) return false

    // Hold set filters
    const holdSetFilters = [
      { enabled: filter.osh, value: 0 },
      { enabled: filter.hsa, value: 1 },
      { enabled: filter.hsb, value: 2 },
      { enabled: filter.hsc, value: 3 },
      { enabled: filter.wha, value: 4 },
      { enabled: filter.whb, value: 5 },
      { enabled: filter.whc, value: 6 }
    ]

    if (holdSetFilters.some(({ enabled, value }) => 
      !enabled && row.holdsets.includes(value)
    )) return false

    // Hold inclusion/exclusion filters
    if (!filterHolds(filter.included, row)) return false
    if (!filterExcludedHolds(filter.excluded, row)) return false

    return true
  }

  // Popup handlers
  const closePopup = () => setShowPopup(false)
  const openPopup = (row) => {
    setShowPopup(true)
    setPopupClimb(row)
  }
  const handleNext = () => {
    const tableData = data.filter(row => filterRow(row))
    if (tableData[tableData.length - 1].id === popupClimb.id) return
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].id === popupClimb.id) {
        setPopupClimb(tableData[i + 1])
        break
      }
    }
  }
  const handlePrevious = () => {
    const tableData = data.filter(row => filterRow(row))
    if (tableData[0].id === popupClimb.id) return
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i].id === popupClimb.id) {
        setPopupClimb(tableData[i - 1])
        break
      }
    }
  }

  const canvasRef = useRef(null)

  return (
    <div className="app d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar bg="dark" collapseOnSelect variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              src="moon-logo.png"
              width="30"
              height="30"
              alt="Moon Logo"
              className="d-inline-block align-top"
            />&nbsp;
            Moonboard Guidebook</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav defaultActiveKey={mbtype}>
              <Nav.Link onClick={() => setMbtype(0)} eventKey="0">2016 40°</Nav.Link>
              <Nav.Link onClick={() => setMbtype(1)} eventKey="1">2017 25°</Nav.Link>
              <Nav.Link onClick={() => setMbtype(2)} eventKey="2">2017 40°</Nav.Link>
              <Nav.Link onClick={() => setMbtype(3)} eventKey="3">2019 25°</Nav.Link>
              <Nav.Link onClick={() => setMbtype(4)} eventKey="4">2019 40°</Nav.Link>
              <Nav.Link onClick={() => setMbtype(5)} eventKey="5">2020 40°</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Filters */}
      <Container className="mt-4 mb-4">
        <Form className="bg-light p-4 rounded">
          <Row>
            <Form.Group as={Col} md className="mb-3">
              <Form.Label>Climb Name</Form.Label>
              <Form.Control type="text" placeholder="All" value={filter.climbName} onChange={(e) => setFilter({ ...filter, climbName: e.target.value })} />
            </Form.Group>

            <Form.Group as={Col} md className="mb-3">
              <Form.Label>Setter</Form.Label>
              <Form.Control type="text" placeholder="All" value={filter.setter} onChange={(e) => setFilter({ ...filter, setter: e.target.value })} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Grade
              </Form.Label>

              <span className="d-flex flex-row">
                <Form.Select value={filter.gradeMin} onChange={(e) => setFilter({ ...filter, gradeMin: e.target.value })}>
                  {Object.values(gradeMap).map((grade, index) => (
                    <option value={index} key={index}>{grade}</option>
                  ))}
                </Form.Select>
                <span className="my-auto mx-2">to</span>
                <Form.Select value={filter.gradeMax} onChange={(e) => setFilter({ ...filter, gradeMax: e.target.value })}>
                  {Object.values(gradeMap).map((grade, index) => (
                    <option value={index} key={index}>{grade}</option>
                  ))}
                </Form.Select>
              </span>
            </Form.Group>

            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Sandbag Score
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip>Calculated using the difference between user grades and official grades</Tooltip>}
                >
                  <FontAwesomeIcon className="mx-1" style={{ color: "grey" }} icon={faCircleQuestion} />
                </OverlayTrigger>
              </Form.Label>
              <span className="d-flex flex-row">
                <Form.Control type="text" placeholder="Minimum" value={filter.sandbagMin} onChange={(e) => setFilter({ ...filter, sandbagMin: e.target.value })} />
                <span className="my-auto mx-2">to</span>
                <Form.Control type="text" placeholder="Maximum" value={filter.sandbagMax} onChange={(e) => setFilter({ ...filter, sandbagMax: e.target.value })} />
              </span>
            </Form.Group>

            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Repeats
              </Form.Label>
              <span className="d-flex flex-row">
                <Form.Control type="text" placeholder="Minimum" value={filter.repeatsMin} onChange={(e) => setFilter({ ...filter, repeatsMin: e.target.value })} />
                <span className="my-auto mx-2">to</span>
                <Form.Control type="text" placeholder="Maximum" value={filter.repeatsMax} onChange={(e) => setFilter({ ...filter, repeatsMax: e.target.value })} />
              </span>
            </Form.Group>

            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Stars
              </Form.Label>
              <span className="d-flex flex-row">
                <Form.Control type="text" placeholder="Minimum" value={filter.starsMin} onChange={(e) => setFilter({ ...filter, starsMin: e.target.value })} />
                <span className="my-auto mx-2">to</span>
                <Form.Control type="text" placeholder="Maximum" value={filter.starsMax} onChange={(e) => setFilter({ ...filter, starsMax: e.target.value })} />
              </span>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} md={3} className="mb-3">
              <Form.Label>
                Average Attempts
              </Form.Label>
              <span className="d-flex flex-row">
                <Form.Control type="text" placeholder="Minimum" value={filter.attemptsMin} onChange={(e) => setFilter({ ...filter, attemptsMin: e.target.value })} />
                <span className="my-auto mx-2">to</span>
                <Form.Control type="text" placeholder="Maximum" value={filter.attemptsMax} onChange={(e) => setFilter({ ...filter, attemptsMax: e.target.value })} />
              </span>
            </Form.Group>


            <Form.Group as={Col} md={3} className="mb-3">
              <Form.Label>
                Date Created
              </Form.Label>
              <span className="d-flex flex-row">
                <DatePicker placeholderText={"Earliest"} className="form-control" selected={filter.dateMin} onChange={(date) => setFilter({ ...filter, dateMin: date })} />
                <span className="my-auto mx-2">to</span>
                <DatePicker placeholderText={"Latest"} className="form-control" selected={filter.dateMax} onChange={(date) => setFilter({ ...filter, dateMax: date })} />
              </span>
            </Form.Group>

            <Form.Group as={Col} md={6} className="mb-3">
              <Form.Label>
                Hold Sets
              </Form.Label>
              <div>
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
                    <img alt="White Hold" src="white-hold.png"></img>
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
                    <img alt="Black Hold" src="black-hold.png"></img>
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
                    <img alt="Yellow Hold" src="yellow-hold.png"></img>
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
                    <img alt="Red Hold" src="red-hold.png"></img>
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
                    <img alt="Wood Hold A" src="woodenA-hold.png"></img>
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
                    <img alt="Wood Hold B" src="woodenB-hold.png"></img>
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
                    <img alt="Wood Hold C" src="woodenC-hold.png"></img>
                  </OverlayTrigger>}
                />
              </div>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Included Holds
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
                >
                  <FontAwesomeIcon className="mx-1" style={{ color: "grey" }} icon={faCircleQuestion} />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control type="text" placeholder="None" value={filter.included} onChange={(e) => setFilter({ ...filter, included: e.target.value })} />
            </Form.Group>

            <Form.Group as={Col} md className="mb-3">
              <Form.Label>
                Excluded Holds
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip>Enter as a list of coordinates according to board layout</Tooltip>}
                >
                  <FontAwesomeIcon className="mx-1" style={{ color: "grey" }} icon={faCircleQuestion} />
                </OverlayTrigger>
              </Form.Label>
              <Form.Control type="text" placeholder="None" value={filter.excluded} onChange={(e) => setFilter({ ...filter, excluded: e.target.value })} />
            </Form.Group>
          </Row>

          <Row className="mt-1">
            <Col>
              <ToggleButton
                id="toggle-check"
                type="checkbox"
                variant="outline-secondary"
                checked={showLayout}
                onChange={(e) => setShowLayout(e.currentTarget.checked)}
              >
                Show Board Layout
              </ToggleButton>
            </Col>
          </Row>

          <Row>
            <Collapse in={showLayout}>
              <div>
                <img src={
                  mbtype === 0 ? "2016.png" : ((mbtype === 1 || mbtype === 2) ? "2017.png" : ((mbtype === 3 || mbtype === 4) ? "2019.png" : "2020.png"))
                } alt={
                  mbtype === 0 ? "2016 Layout" : ((mbtype === 1 || mbtype === 2) ? "2017 Layout" : ((mbtype === 3 || mbtype === 4) ? "2019 Layout" : "2020 Layout"))
                } className="mt-2" style={{ maxWidth: "100%" }}></img>
              </div>
            </Collapse>
          </Row>
        </Form>
      </Container>

      {/* Table */}
      <Container className="flex-1">
        {errorLoadingData && <div>Error: {errorLoadingData}</div>}
        {loadingData && <div><center><Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner></center></div>}
        {data && (
          <><div><p>Found <strong>{data.filter(row => filterRow(row)).length}</strong> benchmark{data.filter(row => filterRow(row)).length === 1 ? null : "s"}. Data and benchmark list is accurate as of late 2023.</p></div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Climb Name</u>
                    {sort.column === "name" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("setter")}>Setter</u>
                    {sort.column === "setter" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("grade")}>Grade</u>
                    {sort.column === "grade" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("sandbag_score")}>Sandbag Score</u>
                    {sort.column === "sandbag_score" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("repeats")}>Repeats</u>
                    {sort.column === "repeats" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("avg_user_stars")}>Stars</u>
                    {sort.column === "avg_user_stars" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("avg_user_attempts")}>Average Attempts</u>
                    {sort.column === "avg_user_attempts" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    <u style={{ cursor: "pointer" }} onClick={() => handleSort("date_created")}>Date Created</u>
                    {sort.column === "date_created" ? (sort.order === "asc" ? <FontAwesomeIcon className="mx-1" icon={faArrowDown} /> : <FontAwesomeIcon className="mx-1" icon={faArrowUp} />) : null}
                  </th>
                  <th>
                    Hold Sets
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.filter(row => filterRow(row)).map((row) => (
                  <tr key={row.id}>
                    <td><u style={{ cursor: "pointer" }} onClick={() => openPopup(row)}>{row.name}</u></td>
                    <td>{row.setter}</td>
                    <td>{gradeMap[row.grade]}{" "}{row.upgraded ? <FontAwesomeIcon icon={faCircleUp}></FontAwesomeIcon> : null} {row.downgraded ? <FontAwesomeIcon icon={faCircleDown}></FontAwesomeIcon> : null}</td>
                    <td style={{ color: row.sandbag_score > 1 ? "red" : row.sandbag_score < -1 ? "green" : "black" }}>{Math.round(row.sandbag_score * 1000) / 1000}</td>
                    <td>{row.repeats}</td>
                    <td>{row.avg_user_stars}</td>
                    <td>{row.avg_user_attempts}</td>
                    <td>{row.date_created.toISOString().slice(0, 10).replace(/-/g, '/')}</td>
                    <td>
                      {row.holdsets.includes(1) ? <img alt="White Hold" src="white-hold.png"></img> : null}
                      {row.holdsets.includes(2) ? <img alt="Black Hold" src="black-hold.png"></img> : null}
                      {row.holdsets.includes(0) ? <img alt="Yellow Hold" src="yellow-hold.png"></img> : null}
                      {row.holdsets.includes(3) ? <img alt="Red Hold" src="red-hold.png"></img> : null}
                      {row.holdsets.includes(4) ? <img alt="Wooden A Hold" src="woodenA-hold.png"></img> : null}
                      {row.holdsets.includes(5) ? <img alt="Wooden B Hold" src="woodenB-hold.png"></img> : null}
                      {row.holdsets.includes(6) ? <img alt="Wooden C Hold" src="woodenC-hold.png"></img> : null}
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
          <Modal.Title>{popupClimb.name}, {gradeMap[popupClimb.grade]}</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <canvas ref={canvasRef} id="circles-canvas" style={{ maxWidth: "100%", background: `url(${mbtype === 0 ? "2016.png" : ((mbtype === 1 || mbtype === 2) ? "2017.png" : ((mbtype === 3 || mbtype === 4) ? "2019.png" : "2020.png"))})`, backgroundSize: "100%" }} width="450" height={mbtype === 5 ? 485 : 692} />
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={handlePrevious} style={{ width: "90px" }}>Previous</Button>
          <a href={
            "https://www.youtube.com/results?search_query=\"" +
            popupClimb.name.replace(/ /g, "+") + "\"+" +
            gradeMap[popupClimb.grade].replace("+", "%2B").replace(" ", "+").replace("(", "").replace(")", "") +
            "+moonboard+benchmark"
          } target="_blank" rel="noopener noreferrer"><Button variant="outline-primary"><FontAwesomeIcon icon={faYoutube} /> Beta Videos</Button></a>
          <Button variant="secondary" onClick={handleNext} style={{ width: "90px" }}>Next</Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="footer mt-auto">
        <Container className="pt-3">
          <center>
            <p>Note: This website is unofficial and unaffiliated with Moon Climbing.<br /><a href="https://github.com/smchase/Moonboard-Guidebook">View on GitHub</a></p>
          </center>
        </Container>
      </footer>
    </div >
  )
}
