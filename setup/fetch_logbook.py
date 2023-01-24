import requests
import json
import shutil
from get_access_token import get_access_token
from secret import username


def request_data(n=0, access_kwargs={}):
	'''
	Request logbook from moonboard api

	Args:
	  n (int): download 'startline'. Not used here. In case of >5000 lines?
	  access_kwargs (dict): dict passed to getAccessToken as kwargs

	access_kwargs can be used to pass username and password as kwargs to
	getAccessToken/getRefreshToken
	'''
	URL = f"https://restapimoonboard.ems-x.com/v1/_moonapi/Logbook/{n}?v=8.3.4"

	headers = {
		'accept-encoding': 'gzip, gzip',
		'authorization': f'BEARER {get_access_token(**access_kwargs)}',
		'host': 'restapimoonboard.ems-x.com',
		'user-agent': 'MoonBoard/1.0',
	}

	json = requests.get(URL, headers=headers).json()
	return json


# Request data
json_data = request_data()

# Save to json file
with open("logbook.json", 'w') as file:
	json.dump(json_data, file, indent=4)

