use crate::models::Movie;
use askama::Template;
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};

#[derive(Template)]
#[template(path = "movies.html")]
pub struct MoviesTemplate {
    pub movies: Vec<Movie>,
}

pub struct HtmlTemplate<T: Template>(pub T);

impl<T: Template> IntoResponse for HtmlTemplate<T> {
    fn into_response(self) -> Response {
        match self.0.render() {
            Ok(html) => Response::builder()
                .header("Content-Type", "text/html")
                .body(html.into())
                .unwrap(),
            Err(_) => Response::builder()
                .status(StatusCode::INTERNAL_SERVER_ERROR)
                .body("Template rendering error".into())
                .unwrap(),
        }
    }
}
