const dropTableQuery = 'DROP TABLE IF EXISTS movie_genre, movie, genre;'

const movieQuery = 'CREATE TABLE IF NOT EXISTS movie(' +
  'id int(11) NOT NULL AUTO_INCREMENT,'+
  'title VARCHAR(255) NOT NULL,'+
  'imdb_id VARCHAR(255) NOT NULL,'+
  'poster_url VARCHAR(255) NOT NULL,'+
  'language VARCHAR(255) NULL,'+
  'original_title VARCHAR(255) NULL,'+
  'overview TEXT NULL,'+
  'release_date VARCHAR(255) NULL,'+
  'tagline VARCHAR(255) NULL,'+
  'length INT NULL,'+
  'rating FLOAT NOT NULL,'+
  'num_votes INT NOT NULL,'+
  'PRIMARY KEY(id)'+
');'

const genreQuery = 
  'CREATE TABLE IF NOT EXISTS genre('+
  'id int(11) NOT NULL AUTO_INCREMENT,'+
  'name VARCHAR(255) NOT NULL,'+
  'PRIMARY KEY(id)'+
  ');'

const movieGenreQuery = 
  'CREATE TABLE`movie_genre`('+
  'movie_id int(11) NOT NULL,'+
  'genre_id int(11) NOT NULL,'+
  'FOREIGN KEY(movie_id) REFERENCES movie(id),'+
  'FOREIGN KEY(genre_id) REFERENCES genre(id),'+
  'UNIQUE(movie_id, genre_id)'+
');'

const insertGenresQuery = 
`  INSERT INTO genre(name) VALUES 
  ('documentary'), ('animation'),
  ('drama'), ('history'),
  ('crime'), ('comedy'),
  ('war'), ('fantasy'),
  ('romance'), ('mystery'),
  ('thriller'), ('music'),
  ('family'), ('action'),
  ('adventure'), ('western'),
  ('science fiction'),
  ('horror'), ('tv movie');`


const queries = {
  insertGenresQuery,
  dropTableQuery,
  movieQuery,
  genreQuery,
  movieGenreQuery,
}
module.exports = queries;