const Pool = require('pg').Pool
const pool = new Pool({
	user: 'me',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432,
})

const getBenchmarks = (request, response) => {
	pool.query('SELECT * FROM benchmarks_201640 ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getBenchmarkById = (request, response) => {
	const id = parseInt(request.params.id)

	pool.query('SELECT * FROM benchmarks_201640 WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const createBenchmark = (request, response) => {
	const { name, setter, official_grade } = request.body

	pool.query('INSERT INTO benchmarks_201640 (name, setter, official_grade) VALUES ($1, $2, $3) RETURNING *', [name, setter, official_grade], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`Benchmark added with ID: ${result.insertId}`)
	})
}

const updateBenchmark = (request, response) => {
	const id = parseInt(request.params.id)
	const { name, setter, official_grade } = request.body

	pool.query(
		'UPDATE benchmarks_201640 SET name = $1, setter = $2, official_grade = $3 WHERE id = $4',
		[name, setter, official_grade, id],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Benchmark modified with ID: ${id}`)
		}
	)
}

const deleteBenchmark = (request, response) => {
	const id = parseInt(request.params.id)

	pool.query('DELETE FROM benchmarks_201640 WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Benchmark deleted with ID: ${id}`)
	})
}

module.exports = {
	getBenchmarks,
	getBenchmarkById,
	createBenchmark,
	updateBenchmark,
	deleteBenchmark,
}
