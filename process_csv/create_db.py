import sqlite3
conn = sqlite3.connect('movies.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tconst TEXT UNIQUE,
    primaryTitle TEXT,
    originalTitle TEXT,
    isAdult INTEGER,
    startYear INTEGER,
    runtimeMinutes INTEGER,
    averageRating INTEGER,
    numVotes INTEGER,
    poster_url TEXT
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre TEXT UNIQUE
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS movies_genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_tconst TEXT,
    genre_id INTEGER,
    FOREIGN KEY (movie_tconst) REFERENCES movies(tconst),
    FOREIGN KEY (genre_id) REFERENCES genres(id)
)''')

conn.commit()
conn.close()

