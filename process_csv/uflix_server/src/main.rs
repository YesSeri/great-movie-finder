mod models;
mod routes;
mod templates;

use std::sync::{Arc, Mutex};

use axum::{routing::get, Router};
use routes::*;
use tower_http::services::fs::ServeDir;
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

struct AppState {
    conn: Arc<Mutex<rusqlite::Connection>>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| format!("{}=debug", env!("CARGO_CRATE_NAME")).into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let conn = rusqlite::Connection::open("./movies.db").expect("could not open database");
    let state = Arc::new(AppState {
        conn: Arc::new(Mutex::new(conn)),
    });
    let service = ServeDir::new("assets");
    let app = Router::new()
        .route("/", get(get_movies))
        .route("/about", get(get_about))
        .route("/movies", get(get_movies))
        .route("/movies/:tconst", get(get_movie))
        .nest_service("/assets", service)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("failed to bind to address");

    tracing::debug!(
        "listening on http://{}",
        listener.local_addr().expect("could not get local address")
    );

    axum::serve(listener, app.layer(TraceLayer::new_for_http()))
        .await
        .unwrap();
}
