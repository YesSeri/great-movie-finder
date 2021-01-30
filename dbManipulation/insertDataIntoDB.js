const dotenv = require("dotenv");
const result = dotenv.config();

const knex = require("./knex");
let data = require("./data.json");
data.forEach(async el => {
  knex('movie').insert({
    title: el.title, imdb_id: el.imdbId,
    poster_url: el.posterUrl, language: el.language,
    original_title: el.originalTitle, overview: el.overview,
    release_date: el.releaseDate, tagline: el.tagline,
    length: el.length, rating: el.rating, num_votes: el.numVotes
  })
    .then(function (result) {
      console.log(el.title, "has been inserted.")
    })
    .catch(err => console.error("An error has occured in movie insertion: ", err))

  const data = await knex('movie').where({ imdb_id: el.imdbId }).select('id')
  const movieId = data[0].id
  const genreData = await knex('genre').select()

  el.genres.forEach(genre => {
    genreData.forEach(async dbGenre => {
      if (dbGenre.name === genre.toLowerCase()) {

        try {
          await knex('movie_genre').insert({ movie_id: movieId, genre_id: dbGenre.id });

        } catch (err) {

          console.error("Movie: ", el.title ,"\nAn error has occured in movie_genre insertion: ", err)
        }
      }
    })
  })
})