import pandas as pd
import csv
from config import ratings, basics, merged_path, processed_path, fieldnames

def merge_data(path1, path2, output_path):
    """Merges the two TSV files and saves the result."""
    file1 = pd.read_csv(path1, sep='\t', low_memory=False)
    file2 = pd.read_csv(path2, sep='\t', low_memory=False)

    dataframe = file1.merge(file2, on='tconst')
    dataframe_merged = dataframe[fieldnames]
    dataframe_merged.to_csv(output_path, index=False)
    print('CSV files have been merged.')

def filter_data(output_file, input_file):
    """Filters movies, keeping only the good ones, and saves them to a file."""
    def is_movie(row):
        return row['titleType'] == 'movie'

    def is_good_movie(row):
        rating = float(row['averageRating'])
        num_votes = int(row['numVotes'])
        return rating > 8.2 and num_votes > 1300

    with open(input_file) as csvfile:
        reader = csv.DictReader(csvfile)
        row_arr = [row for row in reader if is_movie(row) and is_good_movie(row)]
        
    with open(output_file, 'w', newline='') as new_file:
        writer = csv.DictWriter(new_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(row_arr)
        print('Data has been filtered and written to file.')

if __name__ == '__main__':
    merge_data(basics['file_name'], ratings['file_name'], merged_path)
    filter_data(processed_path, merged_path)

