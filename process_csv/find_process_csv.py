"This script downloads info about all IMDB movies and filters out all the bad ones"
import os
import urllib.request
import gzip
import shutil
import csv
import sys
from pathlib import Path
import pandas as pd


def delete(dir_path):
    "Deletes folder at specified path"
    try:
        shutil.rmtree(dir_path)
        print(str(dir_path) + ' has been deleted.')
    except OSError:
        print(str(dir_path) + " does not exist, and can't be deleted")


def create_dir(dir_path):
    "Creates a dir at specified path, if it doesn't exist already"
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    print(str(dir_path) + ' has been created.')


def download(output_path, url):
    "Downloads file from URL and saves at output_path"
    print('Beginning file download with urllib2: ' + str(output_path))
    urllib.request.urlretrieve(url, output_path)
    print(str(url) + ' has been downloaded.')


def unzip(data):
    "Recieves a dictonary containing name of zip file and name of output file name and unzips it"
    with gzip.open(data['zip_name'], 'r') as f_in, open(data['file_name'], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
        print(f_out.name + 'has been unzipped, from ' + f_in.name)


def merge_data(path1, path2, output_path):
    "Merges the two TSV files"

    file1 = pd.read_csv(path1, sep='\t', low_memory=False)
    file2 = pd.read_csv(path2, sep='\t', low_memory=False)

    dataframe = file1.merge(file2, on='tconst')

    dataframe_merged = dataframe[['tconst', 'averageRating', 'numVotes', 'titleType']]
    dataframe_merged.to_csv(output_path, index=False)
    print('Csv files have been merged.')


def filter_data(output_file, input_file):
    "Filters the movies, keeping only the good ones, and saving them in a new file."
    def is_movie(row):
        if row[3] == 'movie':
            return True
        return False

    def is_good_movie(row):
        try:
            rating = float(row[1])
            num_votes = int(row[2])
            if rating > 8.2 and num_votes > 1300:
                return True
        except ValueError:
            print('Oops!', sys.exc_info()[0], 'occurred.')
        return False

    with open(input_file) as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        header = next(reader)
        row_arr = [header]
        for row in reader:
            if is_movie(row) and is_good_movie(row):
                row_arr.append(row)
        with open(output_file, 'w', newline='') as new_file:
            writer = csv.writer(new_file)
            writer.writerows(row_arr)
            print('Data has been filtered and written to file.')


if __name__ == '__main__':
    folder = Path.cwd() / 'data'

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
    arr = [ratings, basics]

    delete(folder)
    create_dir(folder)
    for el in arr:
        download(el['zip_name'], el['url'])
        unzip(el)

    merged_path = folder / 'merged.csv'
    merge_data(basics['file_name'], ratings['file_name'], merged_path)

    processed_file = Path.cwd() / folder / 'processed_data.csv'
    filter_data(processed_file, merged_path)
