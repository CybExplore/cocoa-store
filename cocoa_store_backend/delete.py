import os
import glob

def delete_files_with_prefix(root_dir, prefix):
    # Walk through the directory
    for dirpath, _, filenames in os.walk(root_dir):
        # Create a pattern to match files with the prefix
        pattern = os.path.join(dirpath, f'{prefix}*')
        
        # Find all files that match the pattern
        files_to_delete = glob.glob(pattern)
        
        # Delete each file
        for file_path in files_to_delete:
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")

if __name__ == "__main__":
    # Define the root directory and prefix
    root_directory = os.getcwd()
    prefix = '00'
    
    delete_files_with_prefix(root_directory, prefix)
    print("Deletion complete.")
