const path = require('path')
const fs = require('fs')
// Logger
const pino = require('pino');
const expressPino = require('express-pino-logger');
const saveLocation = path.join(__dirname, 'logs', 'log' + Date())
let logger;
if (process.env.NODE_ENV === 'production') {
  logger = createProductionLogger();
} else {
  logger = pino({ prettyPrint: true, level: process.env.LOG_LEVEL || 'info' });
}
const expressLogger = expressPino({ logger });

function createProductionLogger (){
  try {
    logger = require('pino')(pino.destination(saveLocation))
  }
  catch (error) {
    if (error.code === 'ENOENT') {
      console.error('Folder named logs doesn\'t exist. It will be created now.')
      fs.mkdirSync(__dirname + '/logs')
      logger = require('pino')(pino.destination(saveLocation))
    } else {
      throw console.error(error)
    }
  }
  return logger;
}

module.exports = { expressLogger, logger }