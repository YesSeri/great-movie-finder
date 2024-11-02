
if [ -f movies.db ]; then
    mv movies.db movies.db.bak
	echo 'File moved successfully to backup movies.db.bak'
else
    echo 'movies.db not found, nothing to backup.'
fi
python3 create_db.py && echo 'Created db'
python3 movies_to_genres.py && echo 'Inserted movies to genres many to many'
#python3 actors_to_movies.py && echo 'Inserted actors to movies many to many'
