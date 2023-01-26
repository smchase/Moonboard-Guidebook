import requests, json
from mb_types import mb_types

URL = 'https://moonboard.herokuapp.com'

for mb in mb_types:
	print(f'Updating {mb} benchmarks...')
	with open(f'data/processed_{mb}.json', 'r') as rfile:
		benchmarks = json.load(rfile)
		for climb in benchmarks:
			id = climb['id']
			response = requests.get(f'{URL}/benchmarks/id/{id}').json()
			if len(response) == 0:
				# new benchmark
				print('new', climb['name'])
				requests.post(f'{URL}/benchmarks', json=climb)
			else:
				for field in climb:
					if climb[field] != response[0][field] and field != 'date_created':
						# update benchmark
						print('update', field, climb['name'])
						requests.put(f'{URL}/benchmarks/id/{id}', json={field: climb[field]})
