const Pool = require('pg/lib').Pool;
const pool = new Pool({
	user: 'me',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432,
});

const getBenchmarks = (request, response) => {
	const mb_type = request.query.mb_type ? (' AND mb_type = ' + request.query.mb_type) : '';
	const official_grade = request.query.official_grade ? (' AND official_grade = ' + request.query.official_grade) : '';
	const query = 'SELECT * FROM benchmarks WHERE true' + mb_type + official_grade + ' ORDER BY id ASC';

	pool.query(query, (error, results) => {
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

const updateBenchmarkById = (request, response) => {
	const id = parseInt(request.params.id);
	const { user_grade, user_stars, user_attempts, repeats } = request.body;

	pool.query('UPDATE benchmarks SET user_grade = $1, user_stars = $2, user_attempts = $3, repeats = $4 WHERE id = $5', [user_grade, user_stars, user_attempts, repeats, id], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).send(`Benchmark modified with ID: ${id}`);
	});
};

const deleteBenchmarkById = (request, response) => {
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
	updateBenchmarkById,
	deleteBenchmarkById,
};
