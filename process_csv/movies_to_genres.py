
import sqlite3
import csv
import config

conn = sqlite3.connect('movies.db')
cursor = conn.cursor()
filename = config.filtered_path

with open(filename) as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        averageRating = round(float(row['averageRating']) * 10)
        
        cursor.execute('''
        INSERT OR IGNORE INTO movies (tconst, primaryTitle, originalTitle, isAdult, startYear, runtimeMinutes, averageRating, numVotes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
        (row['tconst'], row['primaryTitle'], row['originalTitle'], row['isAdult'], row['startYear'], row['runtimeMinutes'], averageRating, row['numVotes']))
        
        genres = row['genres'].split(',')
        for genre in genres:
            cursor.execute('INSERT OR IGNORE INTO genres (genre) VALUES (?)', (genre,))
            cursor.execute('INSERT INTO movies_genres (movie_tconst, genre_id) VALUES (?, (SELECT id FROM genres WHERE genre = ?))',
                           (row['tconst'], genre))

conn.commit()
conn.close()

