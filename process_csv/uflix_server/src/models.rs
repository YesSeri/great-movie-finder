use askama::Template;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Debug, Template)]
#[template(path = "movie.html")]
pub struct Movie {
    pub tconst: String,
    pub primary_title: String,
    pub original_title: String,
    pub start_year: u32,
    pub num_votes: u32,
    pub runtime_minutes: u32,
    pub average_rating: u32,
    pub poster_url: Option<String>,
    pub languages: String,
    pub genres: Vec<String>,
}
pub fn get_movie(conn: &Connection, tconst: &str) -> Result<Movie> {
    // Query for the main movie data
    let genre_sql = r#"
SELECT
    g.genre
FROM movies m
JOIN movies_genres mg ON m.tconst = mg.movie_tconst
JOIN genres g ON g.id = mg.genre_id
WHERE m.tconst = ?;
    "#; 
    let language_sql = r#"
    SELECT
        m.tconst, m.primaryTitle, m.originalTitle,
        m.startYear, m.runtimeMinutes, m.averageRating,
        m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
    FROM movies m 
    JOIN movies_languages ml ON m.tconst = ml.movie_id
    JOIN languages l ON ml.language_id = l.id
    WHERE m.tconst = ?
    GROUP BY m.tconst;
    "#;

    let mut stmt = conn.prepare(language_sql)?;
    let movie = stmt.query_row([tconst], |row| {
        Ok(Movie {
            tconst: row.get(0)?,
            primary_title: row.get(1)?,
            original_title: row.get(2)?,
            start_year: row.get(3)?,
            runtime_minutes: row.get(4)?,
            average_rating: row.get(5)?,
            poster_url: row.get(6)?,
            num_votes: row.get(7)?,
            languages: row.get(8)?,
            genres: vec![],  // Placeholder, to be filled in below
        })
    })?;

    // Fetch the genres for this movie
    let mut genre_stmt = conn.prepare(genre_sql)?;
    let genre_rows = genre_stmt.query_map([tconst], |row| row.get(0))?;

    // Collect genres into a vector
    let genres: Vec<String> = genre_rows.collect::<Result<_, _>>()?;

    // Return the movie with genres populated
    Ok(Movie { genres, ..movie })
}


#[derive(Deserialize, Debug)]
pub struct Pagination {
    page: usize,
    per_page: usize,
}
impl Pagination {
    pub fn new(page: usize) -> Self {
        Self { page, per_page: 10 }
    }
}
pub fn get_lesser_known_movies(conn: &Connection, pagination: &Pagination) -> Result<Vec<Movie>> {
    let mut stmt = conn.prepare(
        "SELECT 
    m.tconst, m.primaryTitle, m.originalTitle,
    m.startYear, m.runtimeMinutes, m.averageRating, 
    m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
    FROM movies m 
    JOIN movies_languages ml ON m.tconst = ml.movie_id
    JOIN languages l ON ml.language_id = l.id
    GROUP BY m.tconst
    ORDER BY averageRating DESC
    LIMIT ? OFFSET ?;",
    )?;
    let limit = pagination.per_page;
    let offset = pagination.per_page * (pagination.page - 1);
    let movie_iter = stmt.query_map([limit, offset], |row| {
        Ok(Movie {
            tconst: row.get(0)?,
            primary_title: row.get(1)?,
            original_title: row.get(2)?,
            start_year: row.get(3)?,
            runtime_minutes: row.get(4)?,
            average_rating: row.get(5)?,
            poster_url: row.get(6)?,
            num_votes: row.get(7)?,
            languages: row.get(8)?,
            genres: vec![],
        })
    })?;

    let mut movies = Vec::new();
    for movie in movie_iter {
        movies.push(movie?);
    }
    Ok(movies)
}
