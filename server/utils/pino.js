const path = require("path");
const fs = require("fs");
// Logger
const pino = require("pino");
const expressPino = require("express-pino-logger");
let logger;
if (process.env.NODE_ENV === 'production') {
	logger = createProductionLogger();
} else {
	logger = createDevLogger();
}
const expressLogger = expressPino({ logger });

// Production logger outputs to /utils/logs, dev logger outputs to console.
function createProductionLogger() {
	const time = getDateString();
	const saveLocation = path.join(__dirname, "logs", `log-${time}`);
	try {
		logger = require("pino")(pino.destination(saveLocation));
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error("Folder named logs doesn't exist. It will be created now.");
			fs.mkdirSync(__dirname + "/logs");
			logger = require("pino")(pino.destination(saveLocation));
		} else {
			throw console.error(error);
		}
	}
	return logger;
}

function createDevLogger() {
	return pino({ prettyPrint: true, level: process.env.LOG_LEVEL || "info" });
}

// Used for naming the log file
function getDateString() { 
	const date = new Date();
	const year = date.getFullYear();
	const month = `${date.getMonth() + 1}`.padStart(2, "0");
	const day = `${date.getDate()}`.padStart(2, "0");
	const hour = `${date.getHours()}`.padStart(2, "0");
	const minute = `${date.getMinutes()}`.padStart(2, "0");
	return `${year}-${month}-${day}-${hour}${minute}`;
}

module.exports = { expressLogger, logger };
