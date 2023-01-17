const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

app.get('/', (request, response) => {
	response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/benchmarks', db.getBenchmarks)
app.get('/benchmarks/:id', db.getBenchmarkById)
app.post('/benchmarks', db.createBenchmark)
app.put('/benchmarks/:id', db.updateBenchmark)
app.delete('/benchmarks/:id', db.deleteBenchmark)

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
