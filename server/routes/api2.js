const express = require("express");
const axios = require("axios");
const router = express.Router();
const knex = require("../utils/knex");
const { logger } = require("../utils/pino");
const { TMDB_API_KEY } = process.env;
const OMDBUrl = `http://www.omdbapi.com/?apikey=${TMDB_API_KEY}&`;
// const TMDBUrl = `https://api.themoviedb.org/3/movie/550?api_key=${TMDB_API_KEY}`;
const TMDBUrl = `https://api.themoviedb.org/3/movie/tt0068646?api_key=9c485a0eff3c1ee60efba88d6d1718ee`;

router.get("/movies", async (req, res) => {
	const response = await fetchDatabase();
	const { data, pagination } = response;
	console.log(data);

	// const omdbResponse = await fetchOmdbResponse(data);

	// const omdbData = omdbResponse.map((el) => el.data);

	// const combinedArray = combineOmdbAPIAndDb(omdbData, data);

	res.json(data);
});
function fetchDatabase() {
	try {
		return knex('movies')
			.orderBy([{ column: "averageRating", order: "desc" }])
			.paginate({perPage: 5})
	} catch (error) {
		logger.info(error);
	}
}

const fetchTMDB =() => {
	return axios(TMDBUrl);
}

module.exports = router;
