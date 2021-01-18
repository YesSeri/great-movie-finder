# Great Movie Finder

On IMDB:s top 250 list of movies they have a very strict criteria for which movies gets to be there.  They don't disclose exactly what the rules are but it effectively means that there are no foreign films, and no documentaries on the list. I find this a bit sad. 



My goal here is to create a site where you can browse and see both famous and lesser famous great films and documentaries, and find something new to watch. 

Features:

- A top list where you can see movies according to rank.
- A browsing function where you will see randomly selected great movies. 



## Python Script

### Downloading and Unzipping

This script is used to download all the movies and tv series from IMDBs interface. I download the tsv.gz files and unzip them.

Since there are millions of rows I can filter it in Libre Office Calc and probably not in Excel easily either. In Libre Office Calc an error message says all rows can't be seen, because it is to long. 

The download size of the IMDB movies is over 400 mb. 

### The filter

I continue to use python to filter the movies, and output them into a csv file. 

I filter in this way:

`if rating > 8.2 and numVotes > 1300:`

and

`if (row[3] == 'movie')`

`row[3]` is the titleType header.

This takes a little while since there more than a million movies to filter. 

When the filtering is done there are about 500 movies left. I can easily adjust this if I want to include movie with lesser number of votes or movies with a lower rank.

### Usage

The script always outputs all the files to a folder called `data` in directory you are in when you call the script. Make sure you are in the correct folder when you run the script. 

## Server

