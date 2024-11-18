use std::sync::Arc;

use crate::{
    models::{self, get_lesser_known_movies, Language, Pagination},
    templates::{MovieTemplate, MoviesTemplate},
};
use crate::{
    models::{get_filter_languages, get_lesser_known_movies_filtered_by_language},
    AppState,
};
use axum::{
    extract::{self, State},
    http::StatusCode,
    response::IntoResponse,
};
use axum_extra::extract::Query;
use serde::Deserialize;

const ALL_LANGUAGES: i32 = -1;

#[axum::debug_handler]
pub async fn get_movie(
    extract::Path(tconst): extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let conn = &*state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let movie = models::get_movie(conn, &tconst);
    tracing::info!("Movie: {:?}", &movie);
    if let Ok(movie) = movie {
        let template = MovieTemplate::from(movie);
        Ok(template)
    } else {
        tracing::info!("Failed to get a movie. Returning 500.");
        tracing::info!("Tconst: {:?}", tconst);
        Err(StatusCode::NOT_FOUND)
    }
}

// i32 -1 is a placeholder for "all languages"

// #[axum::debug_handler]
// pub async fn get_filter_form(
//     Query(params): Query<Vec<(String, String)>>,
//     State(state): State<Arc<AppState>>,
// ) -> Result<impl IntoResponse, StatusCode> {
//     let conn = &*state.conn.lock().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
//     if params.len() > 12 {
//         return Err(StatusCode::INTERNAL_SERVER_ERROR);
//     }
//
//     let page: usize = params
//         .iter()
//         .find(|el| el.0 == "page")
//         .and_then(|el| el.1.parse().ok())
//         .unwrap_or(1);
//     let pagination = Pagination::new(page);
//     let languages = params
//         .iter()
//         .filter(|(key, _)| key == "languages")
//         .map(|(_, value)| value.parse::<i32>().unwrap_or(ALL_LANGUAGES))
//         .collect::<Vec<i32>>();
//     let movies = if languages.first() == Some(&ALL_LANGUAGES) {
//         get_lesser_known_movies(conn, &pagination)
//     } else {
//         get_lesser_known_movies_filtered_by_language(conn, &pagination, &languages)
//     };
//
//     if let Ok(movies) = movies {
//         Ok(FilteredMoviesTemplate::from(movies))
//     } else {
//         Err(StatusCode::INTERNAL_SERVER_ERROR)
//     }
// }

#[derive(Deserialize, Debug)]
pub struct GetAllMoviesParams {
    pub languages: Option<Vec<i32>>,
    pub page: Option<usize>,
    pub per_page: Option<usize>,
}

// debug handler
#[axum::debug_handler]
pub async fn get_movies(
    Query(params): Query<GetAllMoviesParams>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let conn = &*state
        .conn
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let page = params.page.unwrap_or(1);
    let pagination = Pagination::new(page);
    let languages = params
        .languages
        .filter(|languages| !languages.contains(&ALL_LANGUAGES));
    let movies = if let Some(languages) = &languages {
        get_lesser_known_movies_filtered_by_language(conn, &pagination, languages)
    } else {
        get_lesser_known_movies(conn, &pagination)
    };

    let filter_languages = get_filter_languages(conn);
    let filter_languages: Result<Vec<Language>, rusqlite::Error> =
        filter_languages.map(|mut languages| {
            languages.insert(0, Language::new("All", -1));
            languages
        });

    if let (Ok(movies), Ok(filter_languages)) = (movies, filter_languages) {
        let template = MoviesTemplate::from((movies, filter_languages));
        Ok(template)
    } else {
        tracing::info!("Failed to get movies. Returning 500.");
        tracing::info!("Page: {:?}", &page);
        tracing::info!("Pagination: {:?}", &pagination);
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}
