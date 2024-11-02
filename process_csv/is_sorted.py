
import pandas as pd

def check_sorted_numerically(file_path, column_name):
    # Load the specified column
    df = pd.read_csv(file_path, sep='\t', usecols=[column_name])
    
    # Determine the maximum length of the numeric part for zero-padding
    max_length = df[column_name].str[2:].str.len().max()
    
    # Convert the `tconst` values to zero-padded integers for numeric comparison
    numeric_values = df[column_name].str[2:].str.zfill(max_length).astype(int)
    
    # Identify out-of-order indices
    unsorted_indices = []
    for i in range(1, len(numeric_values)):
        if numeric_values[i] < numeric_values[i - 1]:
            unsorted_indices.append((i - 1, i))
    
    # Print results
    if unsorted_indices:
        print(f"File is not sorted numerically by {column_name}. Unsorted rows found:")
        for prev_index, curr_index in unsorted_indices:
            print(f"Row {prev_index + 2} (tconst={df[column_name][prev_index]}) > "
                  f"Row {curr_index + 2} (tconst={df[column_name][curr_index]})")
    else:
        print(f"The file is sorted numerically by {column_name}.")

# Usage
file_path = 'data/title.basics.tsv'
check_sorted_numerically(file_path, 'tconst')

