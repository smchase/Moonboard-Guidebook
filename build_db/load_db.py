import requests, json
from mb_types import mb_types

URL = 'http://localhost:3000'

mb_map = {
	'2016-40': 0,
	'2017-25': 1,
	'2017-40': 2,
	'2019-25': 3,
	'2019-40': 4,
	'2020-40': 5,
}

holdsets_map = {
	'Original School Holds': 0,
	'Hold Set A': 1,
	'Hold Set B': 2,
	'Wooden Holds': 3,
	'Wooden Holds B': 4,
	'Wooden Holds C': 5,
}

for mb in mb_types:
	print(f'Loading {mb} benchmarks...')
	with open(f'data/processed_{mb}.json', 'r') as rfile:
		benchmarks = json.load(rfile)
		for climb in benchmarks:
			response = requests.post(f'{URL}/benchmarks', json=climb)
			print(response.text)
