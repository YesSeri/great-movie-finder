const express = require("express");
const axios = require("axios");
const router = express.Router();
const knex = require("../utils/knex");
const { logger } = require("../utils/pino");
const { TMDB_API_KEY } = process.env;
const api_key = `?api_key=${TMDB_API_KEY}`
const OMDBUrl = `http://www.omdbapi.com/?apikey=${TMDB_API_KEY}&`;
// const TMDBUrl = `https://api.themoviedb.org/3/movie/550?api_key=${TMDB_API_KEY}`;
const TMDBUrl = `https://api.themoviedb.org/3/movie/`;

// I use my database to find movies I want, and then I pull info about them from TMDB. 
// There is no need to merge DB an TMDB, because all relevant data is in TMDB
// This one gets top movies
router.get("/movies", async (req, res) => {
	const response = await fetchDatabase();
	const { data } = response;
	const tmdbData = await fetchTMDBData(data);
	res.json(tmdbData);
	function fetchDatabase() {
		try {
			return knex('movies')
				.orderBy([{ column: "averageRating", order: "desc" }])
				.paginate({ perPage: 5 })
		} catch (error) {
			logger.info(error);
		}
	}
});
router.get("/movies/random", async (req, res) => {
	const response = await fetchDatabase();
	console.log(response)
	const { data } = response;
	const tmdbData = await fetchTMDBData(data);
	res.json(tmdbData);
	async function fetchDatabase() {

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
		console.log(max)
		return Math.floor(Math.random() * Math.floor(max));
	}
});


// Give array with t const as value
const fetchTMDBData = async (data) => {
	const tmdbResponse = await Promise.all(getTMDBPromises(data));
	const tmdbData = tmdbResponse.map(el => {
		return el.data
	})
	return tmdbData
	function getTMDBPromises(data) {
		const arr = data.map((el) => {
			const url = createUrl(el.tconst)
			return axios(url);
		})
		return arr
	}
	function createUrl(id) {
		return TMDBUrl + id + api_key;
	}
}




module.exports = router;
