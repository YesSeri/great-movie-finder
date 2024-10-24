
import sqlite3
import csv

conn = sqlite3.connect('movies.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS movies (
    tconst TEXT PRIMARY KEY,
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult INTEGER,
    startYear INTEGER,
    runtimeMinutes INTEGER,
    averageRating INTEGER,  -- Changed to INTEGER
    numVotes INTEGER
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre TEXT UNIQUE
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS movie_genres (
    movie_tconst TEXT,
    genre_id INTEGER,
    FOREIGN KEY (movie_tconst) REFERENCES movies(tconst),
    FOREIGN KEY (genre_id) REFERENCES genres(id),
    PRIMARY KEY (movie_tconst, genre_id)
)''')

with open('data/processed_data.csv', newline='', encoding='utf-8') as csvfile:
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
            cursor.execute('INSERT INTO movie_genres (movie_tconst, genre_id) VALUES (?, (SELECT id FROM genres WHERE genre = ?))',
                           (row['tconst'], genre))

conn.commit()
conn.close()

