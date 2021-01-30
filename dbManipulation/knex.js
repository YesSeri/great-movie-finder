const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const config = {
	client: "mysql2",
	connection: {
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
	},
};

const knex = require("knex")(config);

module.exports = knex;
