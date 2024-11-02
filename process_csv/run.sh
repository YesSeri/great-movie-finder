#!/usr/bin/env bash

if [ -z "$IN_NIX_SHELL" ]; then
    nix-shell shell.nix --command "./run.sh"
    exit 0
fi
#python3 download_unzip.py && echo 'Downloaded zips and unzipped them'
echo 'Trying to merge and filter' && python3 merge_filter.py && echo 'Merged and filtered data'

./setup_db.sh
