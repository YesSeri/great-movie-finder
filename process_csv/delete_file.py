import os
from pathlib import Path


def delete(file):
    try:
        os.remove(file)
        print(file + 'has been deleted')
    except FileNotFoundError:
        print(file.name + " does not exist, and can't be deleted")


if __name__ == '__main__':
    basics_file = Path.cwd() / 'title.basics.tsv.gz'
    ratings_file = Path.cwd() / 'title.ratings.tsv.gz'
    delete(basics_file)
    delete(ratings_file)
