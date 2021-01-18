// Express
const express = require('express')
const app = express()

// Logger
const { expressLogger, logger } = require('./utils/pino')

// .env files
const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
  throw result.error
}

app.use(expressLogger);

const PORT = 5000 || process.env.PORT

app.use('/api', require('./routes/api'))
app.use('*', require('./routes/index'))

app.listen(PORT, () => { logger.info(`listening at port ${PORT}`) })