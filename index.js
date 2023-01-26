const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
	app.use(() => {
		if (req.header('x-forwarded-proto') !== 'https')
			res.redirect(`https://${req.header('host')}${req.url}`);
		else
			express.static(path.join(__dirname, 'app/build'));
	});
}

app.route('/benchmarks')
	.get(db.getAllBenchmarks)
	.post(db.createBenchmark);

app.route('/benchmarks/mb_type/:type')
	.get(db.getBenchmarksByType);

app.route('/benchmarks/id/:id')
	.put(db.updateBenchmarkById)
	.delete(db.deleteBenchmarkById)
	.get(db.getBenchmarkById);

app.route('/getlogbook')
	.get(db.getUserLogbook);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'app/build/index.html'));
});

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
});
