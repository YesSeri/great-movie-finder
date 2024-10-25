
import sqlite3
import csv

conn = sqlite3.connect('movies.db')
cursor = conn.cursor()
cursor.execute('PRAGMA synchronous = OFF')
cursor.execute('PRAGMA journal_mode = MEMORY')




filename = 'tsv/name.basics.tsv'
tsv_len = 1
with open(filename) as f:
    for i, _ in enumerate(f):
        tsv_len = i + 1

print(tsv_len)
cursor.execute('''
CREATE TABLE IF NOT EXISTS actors (
    nconst TEXT PRIMARY KEY,
    primaryName TEXT,
    birthYear INTEGER,
    deathYear INTEGER,
    primaryProfession TEXT
)''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS movie_actors (
    movie_tconst TEXT,
    actor_nconst TEXT,
    FOREIGN KEY (movie_tconst) REFERENCES movies(tconst),
    FOREIGN KEY (actor_nconst) REFERENCES actors(nconst),
    PRIMARY KEY (movie_tconst, actor_nconst)
)''')



batch_size = 10000
actor_data = []
movie_actor_data = []
with open(filename, newline='', encoding='utf-8') as tsvfile:
    reader = csv.DictReader(tsvfile, delimiter='\t')
    
    for (i, row) in enumerate(reader):
        if i % batch_size == 0:
            print(i, i/tsv_len)

            cursor.executemany('''
            INSERT OR IGNORE INTO actors (nconst, primaryName, birthYear, deathYear, primaryProfession)
            VALUES (?, ?, ?, ?, ?)''', actor_data)

            cursor.executemany('''
            INSERT OR IGNORE INTO movie_actors (movie_tconst, actor_nconst)
            VALUES (?, ?)''', movie_actor_data)

            actor_data = []
            movie_actor_data = []

        actor_data.append((row['nconst'], row['primaryName'], row['birthYear'], row['deathYear'], row['primaryProfession']))

        movie_ids = row['knownForTitles'].split(',')
        for movie_id in movie_ids:
            movie_actor_data.append((movie_id, row['nconst']))

    cursor.executemany('''
    INSERT OR IGNORE INTO actors (nconst, primaryName, birthYear, deathYear, primaryProfession)
    VALUES (?, ?, ?, ?, ?)''', actor_data)

    cursor.executemany('''
    INSERT OR IGNORE INTO movie_actors (movie_tconst, actor_nconst)
    VALUES (?, ?)''', movie_actor_data)

cursor.execute('CREATE INDEX IF NOT EXISTS idx_movie_actors_movie ON movie_actors(movie_tconst)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_movie_actors_actor ON movie_actors(actor_nconst)')


conn.commit()
conn.close()

