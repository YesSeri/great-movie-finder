use std::{error, path::PathBuf, sync::Arc};
use sha2::{Digest, Sha256};

use crate::{
    models::{self, get_lesser_known_movies, Language, Movie, Pagination},
    templates::{AboutTemplate, MovieTemplate, MoviesTemplate},
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
use tokio::io::AsyncWriteExt;

const ALL_LANGUAGES: i32 = -1;
const CACHE_DIR: &str = "assets/cache";

#[axum::debug_handler]
pub async fn get_about() -> Result<impl IntoResponse, StatusCode> {
    let about_page = AboutTemplate;
    Ok(about_page)
}
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
    let (movies, filter_languages, is_next_page) = {
        let conn = &*state
            .conn
            .lock()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let languages = params
            .languages
            .clone()
            .filter(|languages| !languages.contains(&ALL_LANGUAGES));
        let movies = if let Some(languages) = &languages {
            get_lesser_known_movies_filtered_by_language(conn, &pagination, languages)
        } else {
            get_lesser_known_movies(conn, &pagination)
        };

        let is_next_page = movies
            .as_ref()
            .map(|movies| {
                let total_movies = movies.len();
                total_movies == pagination.per_page
            })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let filter_languages = get_filter_languages(conn);
        let filter_languages: Result<Vec<Language>, rusqlite::Error> =
            filter_languages.map(|mut languages| {
                languages.insert(0, Language::new("All", -1));
                languages
            });
        (movies, filter_languages, is_next_page)
    };

    if let (Ok(mut movies), Ok(filter_languages)) = (movies, filter_languages) {
        for movie in movies.iter_mut() {
            update_poster_url(movie).await;
        }
        let filter_languages_query_string = params.languages.map(|languages| {
            languages
                .iter()
                .map(|language| format!("languages={}", language))
                .collect::<Vec<String>>()
                .join("&")
        });
        tracing::info!("movies length {:?}", movies.len());
        let template = MoviesTemplate::from((
                movies,
                filter_languages,
                filter_languages_query_string,
                page,
                is_next_page,
        ));
        Ok(template)
    } else {
        tracing::info!("Failed to get movies. Returning 500.");
        tracing::info!("Page: {:?}", &page);
        tracing::info!("Pagination: {:?}", &pagination);
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

async fn get_age(file: &tokio::fs::File) -> Result<std::time::Duration, Box<dyn error::Error>> {
    let metadata = file.metadata().await?;
    let creation_time = metadata.created()?;
    let age = creation_time.elapsed()?;
    Ok(age)
}

const CACHE_EXPIRATION_SECS: u64 = 60 * 60 * 24 * 7; // 1 week

pub async fn fetch_image(poster_url: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut hasher = Sha256::new();
    hasher.update(poster_url);
    let poster_url_hash = format!("{:x}", hasher.finalize());
    let cache_file = PathBuf::from(CACHE_DIR).join(format!("{}.jpg", poster_url_hash));
    let absolute_url_cache_file = format!("/{}", cache_file.display());
     if cache_file.exists() {
        if let Ok(file) = tokio::fs::File::open(&cache_file).await {
            let age = get_age(&file).await?;
            if age.as_secs() < CACHE_EXPIRATION_SECS {
                return Ok(absolute_url_cache_file);
            }
        }
        tracing::info!("Removing old cache file: {:?}", &cache_file);
        tokio::fs::remove_file(&cache_file).await?;
    }
    let response = reqwest::get(poster_url).await?;
    let image_data = response.bytes().await?;
    tokio::fs::create_dir_all(CACHE_DIR).await?;
    let mut file = tokio::fs::File::create(&cache_file).await?;
    file.write_all(&image_data).await?;
    Ok(absolute_url_cache_file)
}
