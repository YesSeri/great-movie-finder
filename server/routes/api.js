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
	// const response = await fetchDatabase();
	// const { data, pagination } = response;

	// const omdbResponse = await fetchOmdbResponse(data);

	// const omdbData = omdbResponse.map((el) => el.data);

	// const combinedArray = combineOmdbAPIAndDb(omdbData, data);

	function fakeApiCall() {

		const combinedArray = require('../utils/data')
		res.json(combinedArray);
	}
	setTimeout(fakeApiCall, 500)

	// Just doing this to avoid calling the remote API when developing client
	// res.json(combinedArray);
});

// If you want more than one page (10 results) of movies you can choose this one. Starts with highest rated movie.
// I tested what is fastest between looping through the pages and making a DB request for each that is awaited or using Promise.all. 
// For over ca. 5 pages (50 results) and more it is always faster with Promise.all
router.get("/movies/paginated/:pages", async (req, res) => {
	const { pages } = req.params
	// This is response from first page
	const response = await fetchDatabase();
	const { data, pagination } = response;
	const { lastPage } = pagination
	const promiseArray = getPromiseArray(pages > lastPage ? lastPage : pages)
	const responseArray = await Promise.all(promiseArray);
	let otherPages = [];

	// All responses from 2nd page and onwards are added to an array.
	responseArray.forEach((el) => {
		el.data.forEach(item => {
			extraPages.push(item)
		})
	})
	const allResults = [data, ...extraPages]
	res.json(allResults)
})

function getPromiseArray(pages) {
	let promiseArray = []
	for (let i = 2; i <= pages; i++) {
		promiseArray.push(fetchDatabase(i))
	}
	return promiseArray;
}
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
			logger.error(error)
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
function fetchDatabase(currentPage = 1) {
	try {
		return knex('movies')
			.orderBy([{ column: "averageRating", order: "desc" }])
			.paginate({ perPage: 10, currentPage });
	} catch (error) {
		logger.info(error);
	}
}
module.exports = router;
