const express = require('express')
const router = express.Router();
const knex = require('../utils/knex')

const { logger } = require('../utils/pino')
router.get('/movies', async (req, res) => {

  try {
    const rows = await knex("movies").orderBy([{ column: 'averageRating', order: 'desc' }])
  }
  catch (error) {
    logger.info(Date(), { error })
  }
  res.json(rows);
});

// router.get('/about', function(req, res) {
//     res.send('About Page');
// });

module.exports = router;