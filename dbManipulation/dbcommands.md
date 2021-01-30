CREATE TABLE IF NOT EXISTS `movie` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`title` VARCHAR(255) NOT NULL,
`imdb_id` VARCHAR(255) NOT NULL,
`poster_url` VARCHAR(255) NOT NULL,
`language` VARCHAR(255) NULL,
`original_title` VARCHAR(255) NULL,
`overview` TEXT NULL,
`release_date` VARCHAR(255) NULL,
`tagline` VARCHAR(255) NULL,
`length` INT NULL,
`rating` FLOAT NOT NULL,
`num_votes` INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `genre` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
PRIMARY KEY (id)
);

CREATE TABLE `movie_genre` (
movie_id int(11) NOT NULL,
genre_id int(11) NOT NULL,
created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY (movie_id) REFERENCES movie(id),
FOREIGN KEY (genre_id) REFERENCES genre(id),
UNIQUE (movie_id, genre_id)
);

INSERT INTO genre(name)
VALUES
  ('documentary'), ('animation'),
  ('drama'),       ('history'),
  ('crime'),       ('comedy'),
  ('war'),         ('fantasy'),
  ('romance'),     ('mystery'),
  ('thriller'),    ('music'),
  ('family'),      ('action'),
  ('adventure'),   ('western'),
  ('science Fiction'), 
  ('horror'),      ('tv movie');

CREATE TABLE movie_genre (
movie_id int(11) NOT NULL,
genre_id int(11) NOT NULL,
Constraint FOREIGN KEY (movie_id) REFERENCES movie(id),
Constraint FOREIGN KEY (genre_id) REFERENCES genre(id)
);

# Import data file
LOAD DATA LOCAL INFILE 
	'/home/henrikz/projects/langs/react/great-movie-finder/dbManipulation/data.csv'
 	INTO TABLE movie
	FIELDS TERMINATED BY ',' 
	LINES TERMINATED BY '\n' 
	IGNORE 1 ROWS (title,imdb_id,poster_url,language,original_title,overview,release_date,tagline,length,rating,num_votes);