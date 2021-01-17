from pathlib import Path

from merge_csv import merge_data
from filter_csv import filter_data
from unzip_tsv import unzip

if __name__ == '__main__':
	zip1 = Path.cwd() / 'title.basics.tsv.gz'
	zip2 = Path.cwd() / 'title.ratings.tsv.gz'
	unzip(zip1)
	unzip(zip2)
	merge_data()
	filter_data() # Give input data and name of the file you wish to output

