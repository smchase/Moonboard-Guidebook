import requests, json # modules
from get_access_token import get_access_token
from mb_types import mb_types

def get_problems(holdset, angle, token, pos=0, problems=[]):
	URL = f'https://restapimoonboard.ems-x.com/v1/_moonapi/problems/v3/{holdset}/{angle}/{pos}?v=8.3.4'
	headers = {
		'accept-encoding': 'gzip',
		'authorization': f'BEARER {token}',
		'host': 'restapimoonboard.ems-x.com',
		'user-agent': 'MoonBoard/1.0',
	}

	# request data, update problems
	json_response = requests.get(URL, headers=headers).json()
	if len(problems) == 0:
		problems = json_response['data']
	else:
		problems.extend(json_response['data'])

	# recursively continue until finished
	if len(json_response['data']) == 5000:
		return get_problems(holdset, angle, token, problems[-1]['apiId'], problems)
	else:
		return problems


# load problems for each board into files
token = get_access_token()
for holdset, angle in mb_types:
	print(f"Getting {holdset}-{angle} benchmarks...")
	problems = get_problems(holdset, angle, token)
	benchmarks = []
	for climb in problems:
		if climb['isBenchmark']:
			benchmarks.append(climb)
	with open(f"data/benchmarks-{holdset}-{angle}.json", 'w') as wfile:
		json.dump(benchmarks, wfile, indent='\t')
