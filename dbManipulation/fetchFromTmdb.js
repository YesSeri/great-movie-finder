// After I have used process_csv to get the data inserted into mysql, I will use the data, to make fetch requests from tmdb, to build a new db with all the info I will need for my page

const dotenv = require("dotenv");
const axios = require("axios")
const Movie = require("./movieClass")
dotenv.config();
const { TMDB_API_KEY } = process.env;
const api_key = `?api_key=${TMDB_API_KEY}`
const TMDBUrl = `https://api.themoviedb.org/3/movie/`;

const queries = require("./queries")

const knex = require("./knex");

async function fetchMovieInfo(entry) {
  const id = entry.tconst
  const response = await axios.get(TMDBUrl + id + api_key)
  const movie = new Movie(response.data, entry)
  return movie;
}

async function fetchAllMovieInfo() {
  let dbArray = await getDbInfo()
  dbArray = dbArray.slice(5, 10)
  dbArray.map(el => fetchMovieInfo(el))
  let movieArray = [];
  for (let i = 0; i < dbArray.length; i++) {
    try {
      sleep(1000)
      console.log("Number: " + i);
      console.log("tconst: " + dbArray[i].tconst);
      const movie = await fetchMovieInfo(dbArray[i])
      movieArray.push(movie)
    } catch (error) {
      console.error(error)
      continue;
    }
  }

  function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }
  return movieArray;
}

async function getDbInfo() {
  return await knex('imdb_movie_info').select("*")
}
async function insertDataToDb(data) {
  for (let i = 0; i < data.length; i++) {
    try {

      const el = data[i];

      await knex('movie').insert({
        title: el.title, imdb_id: el.imdbId,
        poster_url: el.posterUrl, language: el.language,
        original_title: el.originalTitle, overview: el.overview,
        release_date: el.releaseDate, tagline: el.tagline,
        length: el.length, rating: el.rating, num_votes: el.numVotes
      })

      const response = await knex('movie').where({ imdb_id: el.imdbId }).select('id')
      const movieId = response[0].id
      const genreData = await knex('genre').select()

      el.genres.forEach(genre => {
        genreData.forEach(async dbGenre => {
          if (dbGenre.name === genre.toLowerCase()) {

            knex('movie_genre').insert({ movie_id: movieId, genre_id: dbGenre.id })
              .then(data = console.log(data))
              .catch(err => console.log(err))
          }
        })
      })

    }
    catch (error) {
      console.error(error)
      continue;
    }
  }
}
async function initiate() {
  try {
    await createTables()
    const movieData = await fetchAllMovieInfo()
    await insertDataToDb(movieData);
  }
  finally {
    knex.destroy();
  }

}
async function createTables() {
  await knex.raw(queries.dropTableQuery);
  await knex.raw(queries.genreQuery);
  await knex.raw(queries.movieQuery);
  await knex.raw(queries.movieGenreQuery);
  await knex.raw(queries.insertGenresQuery);
}
initiate();