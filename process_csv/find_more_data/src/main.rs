use rusqlite::{params, Connection};
use std::path::PathBuf;
use std::{env, fs};
use std::{error::Error, thread, time::Duration};

const HTML_FOLDER: &str = "./html";

fn main() -> Result<(), Box<dyn Error>> {
    let conn = Connection::open("../movies.db")?;
    create_tables(&conn)?;
    let tconsts = get_all_movies_tconst(&conn);
    // create language table many to many
    for tconst in tconsts.iter().skip(110).take(16) {
        let path = PathBuf::from(format!("{}/{}.html", HTML_FOLDER, tconst));

        if !path.exists() {
            thread::sleep(Duration::from_secs(1));
            println!("Downloading html for tconst: {}", tconst);
            download_html(tconst)?;
        }

        let html = std::fs::read_to_string(path)?;
        let languages = extract_languages(&html);
        println!("Languages for tconst {}: {:?}", tconst, languages);

        for language in languages {
            insert_language(&conn, &language)?;
            let _ = insert_movie_language(&conn, tconst, &language);
        }
        let poster_url = fetch_poster_url(tconst)?;
        if let Some(poster_url) = poster_url {
            println!("Poster for tconst {}: {}", tconst, poster_url);
            update_movie_poster(&conn, tconst, &poster_url)?;
        }
    }

    Ok(())
}
fn create_tables(conn: &Connection) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS languages (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS movies_languages (
            movie_id TEXT NOT NULL,
            language_id INTEGER NOT NULL,
            FOREIGN KEY (movie_id) REFERENCES movies(tconst) ON DELETE CASCADE,
            FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
			UNIQUE (movie_id, language_id)
        )",
        [],
    )?;

    Ok(())
}

fn insert_movie_language(
    conn: &Connection,
    tconst: &str,
    language: &str,
) -> Result<(), Box<dyn Error>> {
    let language_id: i32 = conn.query_row(
        "SELECT id FROM languages WHERE name = ?",
        [language],
        |row| row.get(0),
    )?;

    conn.execute(
        "INSERT INTO movies_languages (movie_id, language_id) VALUES (?, ?)",
        params![tconst, language_id],
    )?;
    Ok(())
}
fn insert_language(conn: &Connection, language: &str) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "INSERT OR IGNORE INTO languages (name) VALUES (?)",
        [language],
    )?;
    Ok(())
}

pub fn get_all_movies_tconst(conn: &Connection) -> Vec<String> {
    let mut stmt = conn
        .prepare("SELECT tconst FROM movies ORDER BY startYear DESC;")
        .unwrap();
    let tconst_iter = stmt.query_map([], |row| row.get(0)).unwrap();
    tconst_iter.map(|t| t.unwrap()).collect()
}

pub fn download_html(tconst: &str) -> Result<(), Box<dyn Error>> {
    let url = format!("https://www.imdb.com/title/{}", tconst);
    let response = reqwest::blocking::get(url)?;
    let body = response.text()?;

    let path = format!("{}/{}.html", HTML_FOLDER, tconst);
    fs::write(path, body)?;
    Ok(())
}
use scraper::{Html, Selector};

use serde::Deserialize;

#[derive(Deserialize)]
struct ApiResponse {
    #[serde(rename = "Poster")]
    poster: Option<String>,
}

fn fetch_poster_url(imdb_id: &str) -> Result<Option<String>, Box<dyn Error>> {
    let api_key = std::env::var("OMDB_API_KEY").expect("OMDB_API_KEY not set");
    let url = format!("https://www.omdbapi.com/?apikey={}&i={}", api_key, imdb_id);
    let response: ApiResponse = reqwest::blocking::get(url)?.json()?;
    Ok(response.poster)
}
fn update_movie_poster(
    conn: &Connection,
    tconst: &str,
    poster_url: &str,
) -> Result<(), Box<dyn Error>> {
    conn.execute(
        "UPDATE movies SET poster_url = ? WHERE tconst = ?",
        params![poster_url, tconst],
    )?;
    Ok(())
}

pub fn extract_languages(html: &str) -> Vec<String> {
    let document = Html::parse_document(html);
    let language_selector =
        Selector::parse(r#"li[data-testid="title-details-languages"]>div>ul>li"#).unwrap();

    document
        .select(&language_selector)
        .map(|element| element.text().collect::<String>())
        .collect::<Vec<_>>()
}
