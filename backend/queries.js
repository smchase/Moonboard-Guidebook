const Pool = require('pg/lib').Pool;
const pool = new Pool({
	user: 'me',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432,
});

const getBenchmarks = (request, response) => {
	pool.query('SELECT * FROM benchmarks ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows);
	});
};

const getBenchmarkById = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query('SELECT * FROM benchmarks WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows);
	});
};

const createBenchmark = (request, response) => {
	const { mb_type, name, setter, official_grade, user_grade, user_stars, user_attempts, repeats, upgraded, downgraded, holdsets, date_created } = request.body;

	pool.query('INSERT INTO benchmarks (mb_type, name, setter, official_grade, user_grade, user_stars, user_attempts, repeats, upgraded, downgraded, holdsets, date_created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id', [mb_type, name, setter, official_grade, user_grade, user_stars, user_attempts, repeats, upgraded, downgraded, holdsets, date_created], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(201).send(`Benchmark added with ID: ${results.rows[0].id}`);
	});
};

const updateBenchmark = (request, response) => {
	const id = parseInt(request.params.id);
	const { mb_type, name, setter, official_grade, user_grade, user_stars, user_attempts, repeats, upgraded, downgraded, holdsets, date_created } = request.body;

	pool.query('UPDATE benchmarks SET mb_type = $2, name = $3, setter = $4, official_grade = $5, user_grade = $6, user_stars = $7, user_attempts = $8, repeats = $9, upgraded = $10, downgraded = $11, holdsets = $12, date_created = $13 WHERE id = $1', [id, mb_type, name, setter, official_grade, user_grade, user_stars, user_attempts, repeats, upgraded, downgraded, holdsets, date_created], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).send(`Benchmark modified with ID: ${id}`);
	});
};

const deleteBenchmark = (request, response) => {
	const id = parseInt(request.params.id);

	pool.query('DELETE FROM benchmarks WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).send(`Benchmark deleted with ID: ${id}`);
	});
};

module.exports = {
	getBenchmarks,
	getBenchmarkById,
	createBenchmark,
	updateBenchmark,
	deleteBenchmark,
};
