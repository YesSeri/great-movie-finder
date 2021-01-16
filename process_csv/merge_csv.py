import pandas as pd
from pathlib import Path


def merge_data():
    path1 = Path.cwd() / 'title.basics.tsv'
    path2 = Path.cwd() / 'title.ratings.tsv'
    output_path = Path.cwd() / 'merged.csv'

    file1 = pd.read_csv(path1, sep='\t', low_memory=False)
    file2 = pd.read_csv(path2, sep='\t', low_memory=False)

    df = file1.merge(file2, on='tconst')

    dfMerged = df[['tconst', 'averageRating', 'numVotes', 'titleType']]
    dfMerged.to_csv('merged.csv', index=False)
    print('Csv files have been merged.')


if __name__ == '__main__':
    merge_data()
