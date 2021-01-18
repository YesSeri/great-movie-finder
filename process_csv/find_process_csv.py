import os
import urllib.request
import gzip
import shutil
import csv
import sys
import pandas as pd
from pathlib import Path


def delete(dir_path):

    try:
        shutil.rmtree(dir_path)
        print(str(dir_path) + ' has been deleted.')
    except OSError:
        print(str(dir_path) + " does not exist, and can't be deleted")



def create_dir(folder):
    if not os.path.exists(folder):
        os.makedirs(folder)
    print(str(folder) + ' has been created.')


def download(output_path, url):
    print('Beginning file download with urllib2: ' + str(output_path))
    urllib.request.urlretrieve(url, output_path)
    print(str(url) + ' has been downloaded.')


def unzip(data):
    with gzip.open(data['zip_name'], 'r') as f_in, open(data['file_name'], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
        print(f_out.name + 'has been unzipped, from ' + f_in.name)


def isMovie(row):
    if (row[3] == 'movie'):
        return True
    return False


def isGoodMovie(row):
    try:
        rating = float(row[1])
        numVotes = int(row[2])
        if rating > 8.2 and numVotes > 1300:
            return True
    except ValueError:
        print('Oops!', sys.exc_info()[0], 'occurred.')
    return False


def merge_data(path1, path2, output_path):

    file1 = pd.read_csv(path1, sep='\t', low_memory=False)
    file2 = pd.read_csv(path2, sep='\t', low_memory=False)

    df = file1.merge(file2, on='tconst')

    dfMerged = df[['tconst', 'averageRating', 'numVotes', 'titleType']]
    dfMerged.to_csv(output_path, index=False)
    print('Csv files have been merged.')


def filter_data(output_file, input_file):
    with open(input_file) as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        header = next(reader)
        row_arr = [header]
        for row in reader:
            if isMovie(row) and isGoodMovie(row):
                row_arr.append(row)
        with open(output_file, 'w', newline='') as newFile:
            writer = csv.writer(newFile)
            writer.writerows(row_arr)
            print('Data has been filtered and written to file.')


if __name__ == '__main__':
    folder = Path.cwd() / 'data'
    basics = {
        'file_name': folder / 'title.basics.tsv',
        'zip_name': folder / 'title.basics.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.basics.tsv.gz',
    }
    ratings = {
        'file_name': folder / 'title.ratings.tsv',
        'zip_name':  folder / 'title.ratings.tsv.gz',
        'url': 'https://datasets.imdbws.com/title.ratings.tsv.gz',
    }
    arr = [basics, ratings]

    delete(folder)
    create_dir(folder)
    for el in arr:
        download(el['zip_name'], el['url'])
        unzip(el)

    merged_path = Path.cwd() / folder / 'merged.csv'
    merge_data(basics['file_name'], ratings['file_name'], merged_path)

    processed_file = Path.cwd() / folder / 'processed_data.csv'
    filter_data(processed_file, merged_path)
