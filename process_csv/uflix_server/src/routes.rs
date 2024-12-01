use std::sync::Arc;

use std::path::Path;

use crate::{
    models::{self, get_lesser_known_movies, get_movie_count, Language, Movie, Pagination},
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
use reqwest;
use serde::Deserialize;
use tokio::fs as tokio_fs;
use tokio::io::AsyncWriteExt;

const ALL_LANGUAGES: i32 = -1;
const CACHE_DIR: &str = "assets/cache";

#[axum::debug_handler]
pub async fn get_movie(
    extract::Path(tconst): extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let mut movie = {
        let conn = &*state
            .conn
            .lock()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        models::get_movie(conn, &tconst).map_err(|_| StatusCode::NOT_FOUND)?
    };

    update_poster_url(&mut movie).await;

    let template = MovieTemplate::from(movie);
    Ok(template)
}
async fn update_poster_url(movie: &mut Movie) {
    if let Some(ref poster_url) = movie.poster_url {
        if let Ok(local_image_path) = fetch_image(poster_url).await {
            movie.poster_url = Some(local_image_path);
        } else {
            movie.poster_url = Some("#".to_string());
        }
    }
}

#[derive(Deserialize, Debug)]
pub struct GetAllMoviesParams {
    pub languages: Option<Vec<i32>>,
    pub page: Option<usize>,
    pub _per_page: Option<usize>,
}

#[axum::debug_handler]
pub async fn get_movies(
    Query(params): Query<GetAllMoviesParams>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let page = params.page.unwrap_or(1);
    let pagination = Pagination::new(page);
    let (movies, filter_languages, total_pages) = {
        let conn = &*state
            .conn
            .lock()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let movie_count = get_movie_count(conn).unwrap_or(1000);
        let total_pages = movie_count / pagination.per_page + 1;

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
        (movies, filter_languages, total_pages)
    };

    if let (Ok(mut movies), Ok(filter_languages)) = (movies, filter_languages) {
        for movie in movies.iter_mut() {
            update_poster_url(movie).await;
        }
        let template = MoviesTemplate::from((movies, filter_languages, page, total_pages));
        Ok(template)
    } else {
        tracing::info!("Failed to get movies. Returning 500.");
        tracing::info!("Page: {:?}", &page);
        tracing::info!("Pagination: {:?}", &pagination);
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

use sha2::{Digest, Sha256};

pub async fn fetch_image(poster_url: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut hasher = Sha256::new();
    hasher.update(poster_url);
    let poster_url_hash = format!("{:x}", hasher.finalize());
    let cache_file = format!("{}/{}.jpg", CACHE_DIR, poster_url_hash);
    let absolute_url_cache_file = format!("/{cache_file}");

    if Path::new(&cache_file).exists() {
        return Ok(absolute_url_cache_file);
    }

    let response = reqwest::get(poster_url).await?;
    let image_data = response.bytes().await?;
    tokio_fs::create_dir_all(CACHE_DIR).await?;
    let mut file = tokio_fs::File::create(&cache_file).await?;
    file.write_all(&image_data).await?;
    Ok(absolute_url_cache_file)
}
