import json

mb_types = [
	("1", "0"), # MoonBoard 2016 40°
	("15", "1"), # MoonBoard Masters 2017 40°
	("15", "2"), # MoonBoard Masters 2017 25°
	("17", "1"), # MoonBoard Masters 2019 40°
	("17", "2"), # MoonBoard Masters 2019 25°
	("19", "1"), # Mini MoonBoard 2020 40°
]

for holdset, angle in mb_types:
	benchmarks = []

	with open(f"data/problems-{holdset}-{angle}.json") as problems_file:
		data = json.load(problems_file)
		for problem in data:
			if problem['isBenchmark']:
				benchmarks.append(problem)

	with open(f"data/benchmarks-{holdset}-{angle}.json", 'w') as benchmarks_file:
		json.dump(benchmarks, benchmarks_file, indent="\t")
