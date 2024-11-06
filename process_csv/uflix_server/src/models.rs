use askama::Template;
use rusqlite::{Connection, Result, Row};
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

const GENRE_QUERY: &str = r#"
SELECT
g.genre
FROM movies m
JOIN movies_genres mg ON m.tconst = mg.movie_tconst
JOIN genres g ON g.id = mg.genre_id
WHERE m.tconst = ?;
"#;
const MOVIE_QUERY: &str = r#"
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
const FILTER_LANGUAGES_QUERY: &str = r#"
SELECT
    l.name, l.id
FROM languages l;
"#;
const FILTER_QUERY: &str = "
SELECT
    m.tconst, m.primaryTitle, m.originalTitle,
    m.startYear, m.runtimeMinutes, m.averageRating, 
    m.poster_url, m.numVotes, GROUP_CONCAT(l.name, ', ')
FROM movies m 
JOIN movies_languages ml ON m.tconst = ml.movie_id JOIN languages l ON ml.language_id = l.id
WHERE l.id = ?
GROUP BY m.tconst ORDER BY averageRating DESC
LIMIT ? OFFSET ?;";

const MOVIES_QUERY: &str = r#"
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
    let movie = stmt.query_row([tconst], |row| Movie::parse_movie(row))?;

    let mut genre_stmt = conn.prepare(GENRE_QUERY)?;
    let genre_rows = genre_stmt.query_map([tconst], |row| row.get(0))?;

    let genres: Vec<String> = genre_rows.collect::<Result<_, _>>()?;

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

#[derive(Debug)]
pub(super) struct Language {
    pub(super) name: String,
    pub(super) id: i32,
}
pub fn get_filter_languages(conn: &Connection) -> rusqlite::Result<Vec<Language>> {
    let mut stmt = conn.prepare(FILTER_LANGUAGES_QUERY)?;
    let language_iter = stmt.query_map([], |row|
        Ok(Language {
            name: row.get(0)?,
            id: row.get(1)?,
        }),
    )?;
    let languages = language_iter.filter_map(Result::ok).collect();
    Ok(languages)
}

pub fn get_lesser_known_movies(conn: &Connection, pagination: &Pagination) -> Result<Vec<Movie>> {
    let mut stmt = conn.prepare(MOVIES_QUERY)?;
    let limit = pagination.per_page;
    let offset = pagination.per_page * (pagination.page - 1);
    let movie_iter = stmt.query_map([limit, offset], |row| Movie::parse_movie(row))?;

    let movies = movie_iter
        .filter_map(Result::ok) // Keeps only `Ok(movie)` and discards `Err(_)`
        .collect::<Vec<Movie>>();
    Ok(movies)
}

pub fn get_lesser_known_movies_filtered(
    conn: &Connection,
    pagination: &Pagination,
    language_ids: Vec<i32>,
) -> Result<Vec<Movie>> {
    let mut stmt = conn.prepare(FILTER_QUERY)?;
    let mut movies = vec![];
    for i in language_ids {
        let limit = pagination.per_page;
        let offset = pagination.per_page * (pagination.page - 1);
        let movie_iter = stmt.query_map([i, limit as i32, offset as i32], |row| Movie::parse_movie(row))?;

        let m = movie_iter
            .filter_map(Result::ok) // Keeps only `Ok(movie)` and discards `Err(_)`
            .collect::<Vec<Movie>>();

        // add the movies to the list that are not already in it
        for movie in m {
            if !movies.contains(&movie) {
                movies.push(movie);
            }
        }
    }

    Ok(movies)
}
