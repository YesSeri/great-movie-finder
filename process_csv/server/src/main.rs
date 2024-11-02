mod models;
use askama_axum::Template;
use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use axum::{
    extract::{self, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use models::{Movie, Pagination};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| format!("{}=debug", env!("CARGO_CRATE_NAME")).into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let conn = rusqlite::Connection::open("../movies.db").unwrap();
    let state = Arc::new(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });
    // build our application with some routes
    let app = Router::new()
        .route("/", get(get_all_movies))
        .route("/movies", get(get_all_movies))
        .route("/movies/:tconst", get(get_movie))
        .with_state(state);

    // run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    tracing::debug!("listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

#[derive(Template)]
#[template(path = "movies.html")]
pub struct MoviesTemplate {
    pub movies: Vec<Movie>,
}

struct AppState {
    conn: Arc<Mutex<rusqlite::Connection>>,
}

async fn get_all_movies(
    Query(params): Query<HashMap<String, String>>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let page = params
        .get("page")
        .and_then(|page| page.parse().ok())
        .unwrap_or(1);
    let pagination = Pagination::new(page);
    let movies = models::get_lesser_known_movies(&conn, pagination);
    if let Ok(movies) = movies {
        let template = MoviesTemplate { movies };

        Ok(template)
    } else {
        Err(StatusCode::INTERNAL_SERVER_ERROR)
    }
}

async fn get_movie(
    extract::Path(tconst): extract::Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<impl IntoResponse, StatusCode> {
    let conn = state.conn.lock().unwrap();
    let movie = models::get_movie(&conn, &tconst);
    tracing::debug!("Movie: {:?}", &movie);
    if let Ok(movie) = movie {
        Ok(movie)
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}
