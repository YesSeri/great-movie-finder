import urllib.request
from pathlib import Path


def download(output_path, url):
    print('Beginning file download with urllib2: ' + str(output_path))
    urllib.request.urlretrieve(url, output_path)
    print(str(url) + ' has been downloaded.')


if __name__ == '__main__':
    basics_output = Path.cwd() / 'title.basics.tsv.gz'
    ratings_output = Path.cwd() / 'title.ratings.tsv.gz'
    basics_url = 'https://datasets.imdbws.com/title.basics.tsv.gz'
    ratings_url = 'https://datasets.imdbws.com/title.ratings.tsv.gz'
    download(ratings_output, ratings_url)
    download(basics_output, basics_url)
