import requests
import json
from get_access_token import get_access_token

URL = f"https://restapimoonboard.ems-x.com/v1/_moonapi/Logbook/0?v=8.3.4"

headers = {
	'accept-encoding': 'gzip, gzip',
	'authorization': f'BEARER {get_access_token()}',
	'host': 'restapimoonboard.ems-x.com',
	'user-agent': 'MoonBoard/1.0',
}

jsonData = requests.get(URL, headers=headers).json()
print(jsonData)

# Save to json file
with open("logbook.json", 'w') as file:
	json.dump(jsonData, file, indent=4)

