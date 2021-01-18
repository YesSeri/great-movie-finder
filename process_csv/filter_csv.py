import csv
import sys
from pathlib import Path


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


def filter_data(output_name='processed_data.csv'):
    output_file = Path.cwd() / output_name
    input_file = Path.cwd() / 'merged.csv'

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
    filter_data()
