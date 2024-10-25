from pathlib import Path

# Base directory for data storage
folder = Path.cwd() / 'data'

# File paths and URLs for IMDb datasets
url = 'https://datasets.imdbws.com/title.ratings.tsv.gz'

ratings = {
    'file_name': folder / 'title.ratings.tsv',
    'zip_name': folder / 'title.ratings.tsv.gz',
    'url': f'{url}/title.ratings.tsv.gz',
}

basics = {
    'file_name': folder / 'title.basics.tsv',
    'zip_name': folder / 'title.basics.tsv.gz',
    'url': f'{url}/title.basics.tsv.gz',
}

name = {
    'file_name': folder / 'name.basics.tsv',
    'zip_name': folder / 'name.basics.tsv.gz',
    'url': f'{url}/name.basics.tsv.gz',
}

# Output paths
merged_path = folder / 'merged.csv'
processed_path = folder / 'processed_data.csv'

# Fieldnames for CSV output
fieldnames = [
    'averageRating', 'genres', 'isAdult', 'numVotes',
    'originalTitle', 'primaryTitle', 'runtimeMinutes',
    'startYear', 'tconst', 'titleType'
]

