import requests

URL = "https://www.moonboard.com/Problems/GetComments?problemId=19215"
header = {
	"host": "www.moonboard.com",
	"origin": "https://www.moonboard.com",
	"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
	"accept-language": "en-CA,en-US;q=0.9,en;q=0.8",
	"accept-encoding": "gzip, deflate, br",
	"connection": "keep-alive",
	"accept": "*/*",
	"x-requested-with": "XMLHttpRequest",
}
data = {"sort": "", "page": "1", "pageSize": "50", "group": "", "filter": ""}
response = requests.post(URL, data=data, headers=header)
print(response.json())
