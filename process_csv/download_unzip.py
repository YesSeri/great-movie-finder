import os
import urllib.request
import gzip
import shutil
from config import folder, ratings, basics

def create_dir(dir_path):
    """Creates a directory if it doesn't already exist."""
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
    print(str(dir_path) + ' has been created.')

def download_and_unzip(data):
    """Downloads and unzips a file based on the provided dictionary."""
    urllib.request.urlretrieve(data['url'], data['zip_name'])
    print(f"{data['url']} has been downloaded.")
    with gzip.open(data['zip_name'], 'r') as f_in, open(data['file_name'], 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)
        print(f"{f_out.name} has been unzipped from {f_in.name}")

def setup_files():
    """Sets up the necessary files for the main processing script."""
    shutil.rmtree(folder, ignore_errors=True)
    create_dir(folder)
    for data in [ratings, basics]:
        download_and_unzip(data)

if __name__ == '__main__':
    setup_files()

