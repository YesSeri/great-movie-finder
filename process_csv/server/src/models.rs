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
    pub average_rating: f32,
    pub poster_url: Option<String>,
    pub languages: String,
}
pub fn get_movie(conn: &Connection, tconst: &str) -> Result<Movie> {
    let sql = r#"
SELECT
    m.tconst, m.primaryTitle, m.originalTitle,
    m.startYear, m.runtimeMinutes, m.averageRating,
    m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
FROM movies m 
JOIN movies_languages ml ON m.tconst = ml.movie_id
JOIN languages l ON ml.language_id = l.id
WHERE m.tconst = ?
GROUP BY m.tconst
    ;
    "#;
    let mut stmt = conn.prepare(sql)?;
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
        })
    })?;

    Ok(movie)
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
pub fn get_lesser_known_movies(conn: &Connection, pagination: Pagination) -> Result<Vec<Movie>> {
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
    println!("limit: {}, offset: {}", limit, offset);
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
        })
    })?;

    let mut movies = Vec::new();
    for movie in movie_iter {
        movies.push(movie?);
    }
    Ok(movies)
}
