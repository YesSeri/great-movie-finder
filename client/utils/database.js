const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE_NAME
  }
});

module.exports = knex;