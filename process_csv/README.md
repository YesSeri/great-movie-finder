# Processing data from IMDB, to find best movies
## Finding Data
Explanation of data is here https://www.imdb.com/interfaces/.
The data is here: https://datasets.imdbws.com/

You need the two files are `title.basics.tsv.gz` and `title.ratings.tsv`. They get updated daily. 

## Process
First unzip the data and then use merge_csv.py to merge the ratings info with info on what kind of thing it is. Short movie, tv series and movies. 

I only want movies, and they should have a high user rating, and many votes. This is what filter_csv.csv is used for. 

Run create_csv to run both scripts one after another.

## Create DB
CREATE TABLE movies 
	(id INT NOT NULL AUTO_INCREMENT, 
	tconst VARCHAR(255) UNIQUE NOT NULL, 
	averageRating FLOAT NOT NULL, 
	numVotes INT NOT NULL, 
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id));

## Importing CSV to DB

### Windows
LOAD DATA LOCAL INFILE 
	'C:/Programming/omdb-best-series/process_csv/data/processed_data.csv'
 	INTO TABLE movies 
	FIELDS TERMINATED BY ',' 
	LINES TERMINATED BY '\n' 
	IGNORE 1 ROWS (tconst, averageRating, numVotes)
	SET created  = CURRENT_TIMESTAMP();
### Linux
LOAD DATA LOCAL INFILE 
	'/home/henrikz/NAME_OF_PATH/great-movie-finder/process_csv/processed_data.csv'
 	INTO TABLE movies 
	FIELDS TERMINATED BY ',' 
	LINES TERMINATED BY '\n' 
	IGNORE 1 ROWS (tconst, averageRating, numVotes)
	SET created  = CURRENT_TIMESTAMP();