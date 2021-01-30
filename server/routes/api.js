const express = require("express");
const axios = require("axios");
const router = express.Router();
const knex = require("../utils/knex");
const { logger } = require("../utils/pino");
const Movie = require("../utils/movieClass")
const { TMDB_API_KEY } = process.env;
const api_key = `?api_key=${TMDB_API_KEY}`
const TMDBUrl = `https://api.themoviedb.org/3/movie/`;

// if original title = title then set original title null

// I use my database to find movies I want, and then I pull info about them from TMDB. 
// There is no need to merge DB an TMDB, because all relevant data is in TMDB
// This one gets top movies
router.get("/movies/top", async (req, res) => {
	const response = await fetchDatabase();
	const { data } = response;
	const tmdbData = await fetchTMDBData(data);
	let movieArray = []
	// The movie class is used to make sure that only relevant data is kept. 
	for (let i = 0; i < tmdbData.length; i++) {
		const movie = new Movie(tmdbData[i], data[i])
		movieArray.push(movie);
	}
	res.json(movieArray);
	function fetchDatabase() {
		try {
			return knex('movies')
				.orderBy([{ column: "averageRating", order: "desc" }])
				.paginate({ perPage: 5 })
		} catch (error) {
			logger.error(error);
		}
	}
});
// Give array with t const as value
const fetchTMDBData = async (data) => {
	const tmdbResponse = await Promise.all(getTMDBPromises(data));
	const tmdbData = tmdbResponse.map(el => {
		return el.data
	})
	return tmdbData

}
function getTMDBPromises(data) {
	return data.map((el) => {
		const url = createUrl(el.tconst)
		return axios(url);
	})
}

function createUrl(id) {
	return TMDBUrl + id + api_key;
}

router.get("/movies/random", async (req, res) => {
	const response = await fetchDatabaseRandom();
	const { data } = response;
	const tmdbData = await fetchTMDBData(data);
	res.json(tmdbData);
	async function fetchDatabaseRandom() {
		const numberResponse = await knex('movies').count('*')
		max = numberResponse[0]['count(*)']
		const num = getRandomInt(max - 1) + 1
		try {
			return knex('movies').where('id', num)
				.paginate({ perPage: 1 })
		} catch (error) {
			logger.info(error);
		}
	}
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
});




module.exports = router;
