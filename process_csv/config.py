from pathlib import Path

# Base directory for data storage
data_folder = Path.cwd() / 'data'

# File paths and URLs for IMDb datasets
url = 'https://datasets.imdbws.com'

ratings_dict = {
    'file_name': data_folder / 'title.ratings.tsv',
    'zip_name': data_folder / 'title.ratings.tsv.gz',
    'url': f'{url}/title.ratings.tsv.gz',
}

basics_dict = {
    'file_name': data_folder / 'title.basics.tsv',
    'zip_name': data_folder / 'title.basics.tsv.gz',
    'url': f'{url}/title.basics.tsv.gz',
}

name_dict = {
    'file_name': data_folder / 'name.basics.tsv',
    'zip_name': data_folder / 'name.basics.tsv.gz',
    'url': f'{url}/name.basics.tsv.gz',
}

# Output paths
filtered_path = data_folder / 'filtered.csv'

# Fieldnames for CSV output
fieldnames = [
    'averageRating', 'genres', 'isAdult', 'numVotes',
    'originalTitle', 'primaryTitle', 'runtimeMinutes',
    'startYear', 'tconst', 'titleType'
]

