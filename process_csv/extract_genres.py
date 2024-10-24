import csv
from pathlib import Path



def setup_teardown(func):

    def inner(*args, **kwargs):
        # setup
        func(*args, **kwargs)
        # teardown


    return inner
def get_genres(file):
    genre_set = set()
    with open(file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            genres = row['genres'].split(',')
            genre_set.update(genres)
    return genre_set


def write_genres_to_csv(genre_set, genre_file):
    with open(genre_file, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        # write header
        writer.writerow(['genre'])
        for genre in genre_set:
            writer.writerow([genre])

@setup_teardown
def run(*_, **kwargs):
    genre_set = get_genres(kwargs['data_file'])
    write_genres_to_csv(genre_set, kwargs['genre_file'])


if __name__ == '__main__':
    print("RUNNING")
    data_folder = Path.cwd() / 'data'
    processed_file = data_folder / 'processed_data.csv'
    genre_file = data_folder / 'genres.csv'
    run(data_file=processed_file, genre_file=genre_file)
    print("DONE")
