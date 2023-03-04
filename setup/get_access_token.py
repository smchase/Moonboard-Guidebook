import requests
import secret

def get_access_token():
	URL = "https://restapimoonboard.ems-x.com/token"
	headers = {
		"accept-encoding": "gzip",
		"content-type": "application/x-www-form-urlencoded",
		"host": "restapimoonboard.ems-x.com",
		"user-agent": "MoonBoard/1.0",
	}
	data = {
		"username": secret.username,
		"password": secret.password,
		"grant_type": "password",
		"client_id": "com.moonclimbing.mb"
	}
	result = requests.get(URL, headers=headers, data=data)
	return result.json()["access_token"]
