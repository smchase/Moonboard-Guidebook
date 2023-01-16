const Pool = require('pg').Pool
const pool = new Pool({
	user: 'me',
	host: 'localhost',
	database: 'api',
	password: 'password',
	port: 5432,
})
