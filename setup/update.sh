#!/bin/bash
log_dir="logs/$(date +\%Y/\%m/\%d)"
log_file="$log_dir/log_$(date +\%Y-\%m-\%d_\%H:\%M).txt"
exec > log.txt 2>&1
echo "Running update at $(date)"
git pull
python3 -u get_benchmarks.py
python3 -u augment_benchmarks.py
python3 -u process_benchmarks.py
python3 -u update_db.py
echo "Done!"
mkdir -p "$log_dir"
cp log.txt "$log_file"
