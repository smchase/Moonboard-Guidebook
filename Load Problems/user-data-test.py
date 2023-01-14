import requests, json
from bs4 import BeautifulSoup

# load page
URL = f"https://www.moonboard.com/Problems/Details/19215/5FC09F63-05F3-4DAE-A1A5-3AC22C37139A?ui=x"
headers = {
	'host': 'www.moonboard.com',
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'accept-language': 'en-CA,en-US;q=0.9,en;q=0.8',
	'connection': 'keep-alive',
	'accept-encoding': 'gzip, deflate, br',
	'user-agent': ''
}
response = requests.get(URL, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# load user grade data
user_grades = soup.find('div', {'class': 'stat-chart'})
grade_map = {}
for tr in user_grades.find_all('tr'):
	if tr.find('td', {'class': 'grade'}) and tr.find('span', {'class': 'total'}):
		grade = tr.find('td', {'class': 'grade'}).text.strip()
		total = tr.find('span', {'class': 'total'}).text.strip()
		grade_map[grade] = total
print(grade_map)

# load user star data
user_stars = user_grades.find_next('div', {'class': 'stat-chart'})
star_map = {}
for num_stars in range(0, 6):
	star_count = user_stars.find('span', {'id': f'spntot{num_stars}'}).text.strip()
	star_map[5-num_stars] = star_count
print(star_map)

# load user attempt data
attempts_section = soup.find('div', {'id': 'chart'})
attempts_chart = attempts_section.find_next('script').text.strip()
chart_data = json.loads(attempts_chart.replace('kendo.syncReady(function(){jQuery("#chart").kendoChart(', '').replace(');});', ''))
user_attempts = {}
for i, entry in enumerate(chart_data['series'][0]['data'], start=1):
	percent = entry['value']
	user_attempts[i] = percent
print(user_attempts)
