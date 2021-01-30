//Poster path: https://image.tmdb.org/t/p/w500/ + pES4eUEWPjySmp6f59I3RzpEP1I.jpg

// genres[].name, imdb_id, original_language, original_title, overview, poster_path, release_date, runtime, tagline, title, vote_average, vote_count
// This class is used to filter and keep only relevant data. Input are dbdata and TMDB data, and I only keep what I deem necessary.
class Movie {
  constructor(data, dbData) {
    this.title = data.title
    this.imdbId = data.imdb_id;
    this.posterUrl = `https://image.tmdb.org/t/p/w500/${data.poster_path}`
    this.genres = data.genres.map(el => el.name)
    this.language = data.original_language;
    this.originalTitle = data.original_title == data.title ? "" : data.original_title;
    this.overview = data.overview
    this.releaseDate = data.release_date
    this.tagline = data.tagline
    this.length = data.runtime
    this.rating = dbData.averageRating
    this.numVotes = dbData.numVotes
  }
}

module.exports = Movie;