const axios = require('axios');
const Pool = require('pg/lib').Pool;
require('dotenv').config();

const devConfig = {
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	port: process.env.PG_PORT,
};

const proConfig = {
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
};

const pool = new Pool(process.env.NODE_ENV === 'production' ? proConfig : devConfig);

const getAllBenchmarks = (request, response) => {
	pool.query('SELECT * FROM benchmarks ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error;
		}
		response.status(200).json(results.rows);
	});
};

const getBenchmarksByType = (request, response) => {
	const type = parseInt(request.params.type);

	pool.query('SELECT * FROM benchmarks WHERE mb_type = $1', [type], (error, results) => {
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
	const { id, mb_type, name, setter, grade, upgraded, downgraded, repeats, date_created, holdsets, start_holds, mid_holds, end_holds, avg_user_grade, user_grade_breakdown, avg_user_stars, user_stars_breakdown, avg_user_attempts, user_attempts_breakdown } = request.body;

	pool.query('INSERT INTO benchmarks (id, mb_type, name, setter, grade, upgraded, downgraded, repeats, date_created, holdsets, start_holds, mid_holds, end_holds, avg_user_grade, user_grade_breakdown, avg_user_stars, user_stars_breakdown, avg_user_attempts, user_attempts_breakdown) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)', [id, mb_type, name, setter, grade, upgraded, downgraded, repeats, date_created, holdsets, start_holds, mid_holds, end_holds, avg_user_grade, user_grade_breakdown, avg_user_stars, user_stars_breakdown, avg_user_attempts, user_attempts_breakdown], (error, results) => {
		if (error) {
			throw error;
		}
		response.status(201).send(`Benchmark added with ID: ${id}`);
	});
};

const updateBenchmarkById = (request, response) => {
	const id = parseInt(request.params.id);
	const { mb_type, name, setter, grade, upgraded, downgraded, repeats, date_created, holdsets, start_holds, mid_holds, end_holds, avg_user_grade, user_grade_breakdown, avg_user_stars, user_stars_breakdown, avg_user_attempts, user_attempts_breakdown } = request.body;

	pool.query(`UPDATE benchmarks SET
    mb_type = COALESCE($1, mb_type),
    name = COALESCE($2, name),
    setter = COALESCE($3, setter),
    grade = COALESCE($4, grade),
    upgraded = COALESCE($5, upgraded),
    downgraded = COALESCE($6, downgraded),
    repeats = COALESCE($7, repeats),
    date_created = COALESCE($8, date_created),
    holdsets = COALESCE($9, holdsets),
    start_holds = COALESCE($10, start_holds),
    mid_holds = COALESCE($11, mid_holds),
    end_holds = COALESCE($12, end_holds),
    avg_user_grade = COALESCE($13, avg_user_grade),
    user_grade_breakdown = COALESCE($14, user_grade_breakdown),
    avg_user_stars = COALESCE($15, avg_user_stars),
    user_stars_breakdown = COALESCE($16, user_stars_breakdown),
    avg_user_attempts = COALESCE($17, avg_user_attempts),
    user_attempts_breakdown = COALESCE($18, user_attempts_breakdown)
WHERE id = $19`, [mb_type, name, setter, grade, upgraded, downgraded, repeats, date_created, holdsets, start_holds, mid_holds, end_holds, avg_user_grade, user_grade_breakdown, avg_user_stars, user_stars_breakdown, avg_user_attempts, user_attempts_breakdown, id], (error, results) => {
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

const getUserLogbook = async (request, response) => {
	const username = request.query.username;
	const password = request.query.password;
	try {
		const tokenURL = "https://restapimoonboard.ems-x.com/token";
		const tokenHeaders = {
			'accept-encoding': 'gzip',
			'content-type': 'application/x-www-form-urlencoded',
			'host': 'restapimoonboard.ems-x.com',
			'user-agent': 'MoonBoard/1.0',
		};
		const data = {
			'username': username,
			'password': password,
			'grant_type': 'password',
			'client_id': 'com.moonclimbing.mb'
		};
		const tokenResponse = await axios({
			method: 'get',
			url: tokenURL,
			headers: tokenHeaders,
			data: data,
		});
		const access_token = tokenResponse.data.access_token;

		const logbookURL = "https://restapimoonboard.ems-x.com/v1/_moonapi/Logbook/0?v=8.3.4";
		const logbookHeaders = {
			'accept-encoding': 'gzip, gzip',
			'authorization': `BEARER ${access_token}`,
			'host': 'restapimoonboard.ems-x.com',
			'user-agent': 'MoonBoard/1.0',
		};
		const logbookResponse = await axios({
			method: 'get',
			url: logbookURL,
			headers: logbookHeaders,
		});
		let logbook = [];
		for (let i = 0; i < logbookResponse.data.length; i++) {
			logbook.push(logbookResponse.data[i].problem.apiId);
		}
		response.status(200).json(logbook);
	} catch (err) {
		response.status(500).json({ error: "Error logging in" });
	}
};

module.exports = {
	getAllBenchmarks,
	getBenchmarksByType,
	getBenchmarkById,
	createBenchmark,
	updateBenchmarkById,
	deleteBenchmarkById,
	getUserLogbook
};
