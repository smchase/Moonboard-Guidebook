import requests, json # modules
import secret # secret.py file with username and password

def get_problems(holdset, angle, token, pos=0, problems=[]):
	URL = f"https://restapimoonboard.ems-x.com/v1/_moonapi/problems/v3/{holdset}/{angle}/{pos}?v=8.3.4"
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


def get_access_token():
	URL = "https://restapimoonboard.ems-x.com/token"
	headers = {
		'accept-encoding': 'gzip',
		'content-type': 'application/x-www-form-urlencoded',
		'host': 'restapimoonboard.ems-x.com',
		'user-agent': 'MoonBoard/1.0',
	}
	data = {
		'username': secret.username,
		'password': secret.password,
		'grant_type': 'password',
		'client_id': 'com.moonclimbing.mb'
	}
	result = requests.get(URL, headers=headers, data=data)
	return result.json()['access_token']


# load problems for each board into files
token = get_access_token()
mb_types = [
	("1", "0"), # MoonBoard 2016 40°
	("15", "1"), # MoonBoard Masters 2017 40°
	("15", "2"), # MoonBoard Masters 2017 25°
	("17", "1"), # MoonBoard Masters 2019 40°
	("17", "2"), # MoonBoard Masters 2019 25°
	("19", "1"), # Mini MoonBoard 2020 40°
]
for holdset, angle in mb_types:
	problems = get_problems(holdset, angle, token)
	with open(f"data/problems-{holdset}-{angle}.json", 'w') as file:
		json.dump(problems, file, indent="\t")
