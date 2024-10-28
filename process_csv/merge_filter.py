import pandas as pd
import csv
from config import ratings_dict, basics_dict, filtered_path

def filter_data(input_file, output_file, filters):
    with open(input_file) as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        fieldnames = reader.fieldnames
        if not fieldnames:
            raise ValueError('No field names in CSV file.')
        filtered_rows = [row for row in reader if all(f(row) for f in filters)]

    with open(output_file, 'w', newline='') as new_file:
        writer = csv.DictWriter(new_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(filtered_rows)
    print(f'Data has been filtered and written to {output_file}.')

def merge_filtered_data(basics_path, ratings_path, output_path):
    basics_df = pd.read_csv(basics_path, low_memory=False)
    ratings_df = pd.read_csv(ratings_path, low_memory=False)
    
    merged_df = basics_df.merge(ratings_df, on='tconst')
    merged_df.to_csv(output_path, index=False)
    print(f'Filtered data has been merged and saved to {output_path}.')

if __name__ == '__main__':
    basics_filtered_path = basics_dict['file_name'].with_name("basics_filtered.tsv")
    ratings_filtered_path = ratings_dict['file_name'].with_name("ratings_filtered.tsv")

    basics_filters = [
        lambda row: row['titleType'] == 'movie'
    ]
    ratings_filters = [
        lambda row: float(row['averageRating']) > 8.2,
        lambda row: int(row['numVotes']) > 1300
    ]

    filter_data(basics_dict['file_name'], basics_filtered_path, basics_filters)
    filter_data(ratings_dict['file_name'], ratings_filtered_path, ratings_filters)
    merge_filtered_data(basics_filtered_path, ratings_filtered_path, filtered_path)

