from pathlib import Path

from delete_file import delete
from download_file import download
from merge_csv import merge_data
from merge_csv import merge_data
from filter_csv import filter_data
from unzip_tsv import unzip

if __name__ == '__main__':
    basics = {
        'file_name': Path.cwd() / 'title.basics.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.basics.tsv.gz',
    }
    ratings = {
        'file_name': Path.cwd() / 'title.ratings.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.ratings.tsv.gz',
    }
    arr = [basics, ratings]
    for el in arr:
        delete(el['file_name'])
        download(el['file_name'], el['url'])
        unzip(el['file_name'])

    merge_data()
    filter_data()
