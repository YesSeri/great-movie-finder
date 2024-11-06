use std::iter::Filter;
use askama_axum::Template;
use crate::models::{Language, Movie};

#[derive(Template, Debug)]
#[template(path = "movies.html")]
pub struct MoviesTemplate {
    pub movies: Vec<Movie>,
    pub filter_languages: Vec<Language>,
}

impl From<(Vec<Movie>, Vec<Language>)> for MoviesTemplate {
    fn from((movies, filter_languages): (Vec<Movie>, Vec<Language>)) -> Self {
        Self { movies, filter_languages }
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