const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/benchmarks')
	.get(db.getBenchmarks)
	.post(db.createBenchmark);

app.route('/benchmarks/:id')
	.get(db.getBenchmarkById)
	.put(db.updateBenchmarkById)
	.delete(db.deleteBenchmarkById);

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
});
