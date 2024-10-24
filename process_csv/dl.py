"""This script downloads info about all IMDB movies 
and filters out all the bad ones"""
import os
import urllib.request
import gzip
import shutil
import csv
import sys
from pathlib import Path
import pandas as pd

folder = Path.cwd() / 'data'
merged_path = folder / 'merged.csv'
fieldnames= ['averageRating',
             'genres',
             'isAdult',
             'numVotes',
             'originalTitle',
             'primaryTitle',
             'runtimeMinutes',
             'startYear',
             'tconst',
             'titleType',
             ]
ratings = {
        'file_name': folder / 'title.ratings.tsv',
        'zip_name':  folder / 'title.ratings.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.ratings.tsv.gz',
        }
basics = {
        'file_name': folder / 'title.basics.tsv',
        'zip_name': folder / 'title.basics.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.basics.tsv.gz',
        }


def unzip(data):
    """Recieves a dictonary containing name of zip file 
    and name of output file name and unzips it"""
    with gzip.open(data['zip_name'], 'r') as f_in, open(data['file_name'], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
        print(f_out.name + ' has been unzipped, from ' + f_in.name)

def run(*args, **kwargs):
    for el in [ratings, basics]:
        print('Beginning file download with urllib2: ' + str(el['zip_name']))
        urllib.request.urlretrieve(el['url'], el['zip_name'])
        print(str(el['url']) + ' has been downloaded.')
        unzip(el)


if __name__ == '__main__':
    run()
