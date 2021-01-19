// Express
const express = require("express");
const app = express();

// Utils
const { expressLogger, logger } = require("./utils/pino");
const path = require("path");

// .env files
const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
	throw result.error;
}
if (process.env.NODE_ENV === "production") app.use(expressLogger);

const PORT = 8080 || process.env.PORT;

app.use("/api", require("./routes/api"));
app.use("*", require("./routes/index"));

if (process.env.NODE_ENV === "production") {
	const folder = path.join(__dirname, "..", "build");
	app.use(express.static(path.join(folder)));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(folder, "index.html"));
	});
}
app.listen(PORT, () => {
	logger.info({
		message: `listening at port ${PORT}. `,
		url: `localhost:${PORT}`,
		apiUrl: `localhost:${PORT}/api/movies`,
	});
});
