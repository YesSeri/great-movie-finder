const express = require("express");
const axios = require("axios");
const router = express.Router();
const knex = require("../utils/knex");
const { logger } = require("../utils/pino");
const { OMDB_API_KEY } = process.env;
const omdbUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&`;

router.get("/", async (req, res) => {
	res.json({ api: "Welcome to the API" });
});
router.get("/movies", async (req, res) => {
	// const response = await fetchDatabase("movies");
	// const { data, pagination } = response;

	// const omdbResponse = await fetchOmdbResponse(data);

	// const omdbData = omdbResponse.map((el) => el.data);

	// const combinedArray = combineOmdbAPIAndDb(omdbData, data);
	const combinedArray = require('../utils/data') // Just doing this to avoid calling the remote API when developing client
	console.log(combinedArray)
	res.json(combinedArray);
});

function fetchOmdbResponse(data) {
	return Promise.all(
		data.map((el) => {
			return fetchOmdbData(el.tconst);
		})
	);
}

function combineOmdbAPIAndDb(omdbData, data) {
	let combinedArray = [];
	for (let i = 0; i < data.length; i++) {
		try {
			if (omdbData[i].imdbID !== data[i].tconst)
				throw new Error("Id's not matching.");
			const combinedObject = {
				...omdbData[i],
				...data[i],
			};
			combinedArray = [...combinedArray, combinedObject];
		} catch (error) {
			console.log(error);
			res.json({ errorName: error.name, errorMessage: error.message });
		}
	}
	return combinedArray;
}
function fetchOmdbData(imdbCode) {
	const query = `i=${imdbCode}`;
	const omdbData = axios(omdbUrl + query);
	return omdbData;
}
function fetchDatabase(databaseName) {
	try {
		return knex(databaseName)
			.orderBy([{ column: "averageRating", order: "desc" }])
			.paginate({ perPage: 2 });
	} catch (error) {
		logger.info(error);
	}
}
module.exports = router;
