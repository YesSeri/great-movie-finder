use crate::models::{Language, Movie};
use askama_axum::Template;

#[derive(Template, Debug)]
#[template(path = "about.html")]
pub struct AboutTemplate;

#[derive(Template, Debug)]
#[template(path = "movies.html")]
pub struct MoviesTemplate {
    pub movies: Vec<Movie>,
    pub filter_languages: Vec<Language>,
    pub filter_languages_query_string: Option<String>,
    pub current_page: usize,
    pub is_next_page: bool,
}

impl From<(Vec<Movie>, Vec<Language>, Option<String>, usize, bool)> for MoviesTemplate {
    fn from(
        (movies, filter_languages, filter_languages_query_string, current_page, is_next_page): (
            Vec<Movie>,
            Vec<Language>,
            Option<String>,
            usize,
            bool,
        ),
    ) -> Self {
        Self {
            movies,
            filter_languages,
            filter_languages_query_string,
            current_page,
            is_next_page,
        }
    }
}

#[derive(Template, Debug)]
#[template(path = "movie_grid.html")]
pub struct FilteredMoviesTemplate {
    pub movies: Vec<Movie>,
}

impl From<Vec<Movie>> for FilteredMoviesTemplate {
    fn from(movies: Vec<Movie>) -> Self {
        Self { movies }
    }
}

#[derive(Template, Debug)]
#[template(path = "movie.html")]
pub struct MovieTemplate {
    tconst: String,
    primary_title: String,
    start_year: u32,
    num_votes: u32,
    runtime_minutes: u32,
    average_rating: u32,
    poster_url: Option<String>,
    languages: String,
    genres: Vec<String>,
}
impl From<Movie> for MovieTemplate {
    fn from(
        Movie {
            tconst,
            primary_title,
            start_year,
            num_votes,
            runtime_minutes,
            average_rating,
            poster_url,
            languages,
            genres,
            ..
        }: Movie,
    ) -> Self {
        Self {
            tconst,
            primary_title,
            start_year,
            num_votes,
            runtime_minutes,
            average_rating,
            poster_url,
            languages,
            genres,
        }
    }
}
