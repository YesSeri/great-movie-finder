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


def create_dir(dir_path):
    """Creates a dir at specified path, 
    if it doesn't exist already"""
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    print(str(dir_path) + ' has been created.')


def unzip(data):
    """Recieves a dictonary containing name of zip file 
    and name of output file name and unzips it"""
    with gzip.open(data['zip_name'], 'r') as f_in, open(data['file_name'], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
        print(f_out.name + ' has been unzipped, from ' + f_in.name)


def merge_data(path1, path2, output_path):
    """Merges the two TSV files"""

    file1 = pd.read_csv(path1, sep='\t', low_memory=False)
    file2 = pd.read_csv(path2, sep='\t', low_memory=False)

    dataframe = file1.merge(file2, on='tconst')

    dataframe_merged = dataframe[fieldnames]
    dataframe_merged.to_csv(output_path, index=False)
    print('Csv files have been merged.')


def filter_data(output_file, input_file):
    """Filters the movies, keeping only the good ones, 
    and saving them in a new file."""
    def is_movie(row):
        return row['titleType'] == 'movie'

    def is_good_movie(row):
        rating = float(row['averageRating'])
        num_votes = int(row['numVotes'])
        return rating > 8.2 and num_votes > 1300

    with open(input_file) as csvfile:
        reader = csv.DictReader(csvfile)
        row_arr = []
        for row in reader:
            if is_movie(row) and is_good_movie(row):
                row_arr.append(row)
        with open(output_file, 'w', newline='') as new_file:
            writer = csv.DictWriter(new_file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(row_arr)
            print('Data has been filtered and written to file.')

def setup_teardown(func):

    def inner1(*args, **kwargs):
        arr = [ratings, basics]
        shutil.rmtree(folder, ignore_errors=True)
        print('creating folder')
        create_dir(folder)
        for el in arr:
            print('Beginning file download with urllib2: ' + str(el['zip_name']))
            urllib.request.urlretrieve(el['url'], el['zip_name'])
            print(str(el['url']) + ' has been downloaded.')
            unzip(el)
        func(*args, **kwargs)
        for el in arr:
            os.remove(el['file_name'])
            os.remove(el['zip_name'])

        os.remove(merged_path)


    return inner1

@setup_teardown
def run(*args, **kwargs):
    merge_data(basics['file_name'], ratings['file_name'], merged_path)
    processed_file = Path.cwd() / folder / 'processed_data.csv'
    filter_data(processed_file, merged_path)


if __name__ == '__main__':
    run()
