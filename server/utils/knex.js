console.log(process.env.USERNAME)
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : process.env.HOST,
    user : process.env.USERNAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE_NAME
  }
});

module.exports = knex;