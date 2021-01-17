from pathlib import Path
import gzip, shutil

def unzip(file):
	with gzip.open(file.name, 'r') as f_in, open(file.name[:-3], 'wb') as f_out:
		shutil.copyfileobj(f_in, f_out)

if __name__ == '__main__':
	file1 = Path.cwd() / 'title.basics.tsv.gz'
	file2 = Path.cwd() / 'title.ratings.tsv.gz'
	unzip(file1)
	unzip(file2)
