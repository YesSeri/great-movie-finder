# Processing data from IMDB, to find best movies
## Finding Data
Explanation of data is here https://www.imdb.com/interfaces/.
The data is here: https://datasets.imdbws.com/
It gets updated daily. 

## Process
I unzip the data and then first use merge_csv.py to merge the ratings info with info on what kind of thing it is. Short movie, tv series and movies. 

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

LOAD DATA LOCAL INFILE 
	'C:/Programming/omdb-best-series/csvHandling/processed_data.csv'
 	INTO TABLE movies 
	FIELDS TERMINATED BY ',' 
	LINES TERMINATED BY '\n' 
	IGNORE 1 ROWS (tconst, averageRating, numVotes)
	SET created  = CURRENT_TIMESTAMP();