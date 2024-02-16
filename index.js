const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("./queries")
const app = express()
const path = require("path")
const enforce = require("express-sslify")
const port = process.env.PORT || 3001

app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
	const host = req.headers.host;
	if (host === "moonboard.herokuapp.com") {
		return res.redirect(301, "https://moonboard.herokuapp.com" + req.originalUrl);
	}
	next();
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "app/build")))
}

app.route("/benchmarks")
	.get(db.getAllBenchmarks)
	.post(db.createBenchmark)

app.route("/benchmarks/mb_type/:type")
	.get(db.getBenchmarksByType)

app.route("/benchmarks/id/:id")
	.put(db.updateBenchmarkById)
	.delete(db.deleteBenchmarkById)
	.get(db.getBenchmarkById)

app.route("/getlogbook")
	.get(db.getUserLogbook)

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "app/build/index.html"))
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
