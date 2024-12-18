use crate::models::queries::*;
use askama::Template;
use rusqlite::{Connection, Result, Row, ToSql};
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

impl PartialEq for Movie {
    fn eq(&self, other: &Self) -> bool {
        self.tconst == other.tconst
    }
}

impl Movie {
    fn parse_movie(row: &Row) -> Result<Movie> {
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
            genres: vec![], // Placeholder, to be filled in below
        })
    }
}

pub fn get_movie(conn: &Connection, tconst: &str) -> Result<Movie> {
    // Query for the main movie data

    let mut stmt = conn.prepare(MOVIE_QUERY)?;
    let movie = stmt.query_row([tconst], Movie::parse_movie)?;

    let mut genre_stmt = conn.prepare(GENRE_QUERY)?;
    let genre_rows = genre_stmt.query_map([tconst], |row| row.get(0))?;

    let genres: Vec<String> = genre_rows.collect::<Result<_, _>>()?;

    Ok(Movie { genres, ..movie })
}

#[derive(Deserialize, Debug)]
pub struct Pagination {
    pub page: usize,
    pub per_page: usize,
}

impl Pagination {
    pub fn new(page: usize) -> Self {
        Self { page, per_page: 10 }
    }
}

#[derive(Debug)]
pub(super) struct Language {
    pub(super) name: String,
    pub(super) id: i32,
}

impl Language {
    pub(super) fn new<S: Into<String>>(name: S, id: i32) -> Self {
        Self {
            name: name.into(),
            id,
        }
    }
}
pub fn get_filter_languages(conn: &Connection) -> Result<Vec<Language>> {
    let mut stmt = conn.prepare(FILTER_LANGUAGES_QUERY)?;
    let language_iter = stmt.query_map([], |row| {
        let name = row.get(0)?;
        let id = row.get(1)?;
        Ok(Language { name, id })
    })?;
    let languages = language_iter.filter_map(Result::ok).collect();
    Ok(languages)
}

pub fn get_lesser_known_movies(conn: &Connection, pagination: &Pagination) -> Result<Vec<Movie>> {
    let mut stmt = conn.prepare(MOVIES_QUERY)?;
    let limit = pagination.per_page;
    let offset = pagination.per_page * (pagination.page - 1);
    let movie_iter = stmt.query_map([limit, offset], Movie::parse_movie)?;

    let movies = movie_iter.filter_map(Result::ok).collect::<Vec<Movie>>();
    Ok(movies)
}

pub fn get_lesser_known_movies_filtered_by_language(
    conn: &Connection,
    pagination: &Pagination,
    language_ids: &[i32],
) -> Result<Vec<Movie>> {
    let placeholders = language_ids
        .iter()
        .map(|_| "?")
        .collect::<Vec<_>>()
        .join(", ");
    let query = format!(
        "
        SELECT DISTINCT
            m.tconst, m.primaryTitle, m.originalTitle,
            m.startYear, m.runtimeMinutes, m.averageRating,
            m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
        FROM movies m
        JOIN movies_languages ml ON m.tconst = ml.movie_id
        JOIN languages l ON ml.language_id = l.id
        WHERE l.id IN ({})
        GROUP BY m.tconst
        ORDER BY m.averageRating DESC
        LIMIT ? OFFSET ?;
        ",
        placeholders
    );

    // Prepare the statement
    let mut stmt = conn.prepare(&query)?;

    // Collect parameters
    let limit = pagination.per_page as i32;
    let offset = ((pagination.page as i32) - 1) * limit;
    let mut params: Vec<&dyn rusqlite::ToSql> =
        language_ids.iter().map(|id| id as &dyn ToSql).collect();
    params.push(&limit);
    params.push(&offset);

    // Execute the query
    let movie_iter = stmt.query_map(params.as_slice(), Movie::parse_movie)?;

    let movies = movie_iter.filter_map(Result::ok).collect::<Vec<Movie>>();
    Ok(movies)
}

mod queries {

    pub const GENRE_QUERY: &str = r#"
SELECT
g.genre
FROM movies m
JOIN movies_genres mg ON m.tconst = mg.movie_tconst
JOIN genres g ON g.id = mg.genre_id
WHERE m.tconst = ?;
    "#;
    pub const MOVIE_QUERY: &str = r#"
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
    pub const FILTER_LANGUAGES_QUERY: &str = r#"
SELECT
    l.name, l.id
FROM languages l
ORDER BY l.name;
    "#;
    pub const MOVIES_QUERY: &str = r#"
SELECT
    m.tconst, m.primaryTitle, m.originalTitle,
    m.startYear, m.runtimeMinutes, m.averageRating,
    m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
FROM movies m JOIN movies_languages ml ON m.tconst = ml.movie_id
JOIN languages l ON ml.language_id = l.id
GROUP BY m.tconst
ORDER BY averageRating DESC
LIMIT ? OFFSET ?;
    "#;
}
