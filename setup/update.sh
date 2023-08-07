#!/bin/bash
exec > log.txt 2>&1
echo "Running update at $(date)"
git pull
python3 -u get_benchmarks.py
python3 -u augment_benchmarks.py
python3 -u process_benchmarks.py
python3 -u update_db.py
