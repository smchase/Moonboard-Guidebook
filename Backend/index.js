const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/benchmarks')
	.get(db.getBenchmarks)
	.post(db.createBenchmark);

app.route('/benchmarks/:id')
	.get(db.getBenchmarkById)
	.put(db.updateBenchmark)
	.delete(db.deleteBenchmark);

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
});
