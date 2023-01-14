import requests, json
from bs4 import BeautifulSoup
from mb_types import mb_types

for holdset, angle in mb_types:
	print(f"Augmenting {holdset}-{angle} benchmarks...")
	with open(f"data/benchmarks-{holdset}-{angle}.json", 'r') as rfile:
		benchmarks = json.load(rfile)
		for climb in benchmarks:
			# load page
			apiId = climb['apiId']
			setbyId = climb['setbyId']
			URL = f'https://www.moonboard.com/Problems/Details/{apiId}/{setbyId}?ui=x'
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
					grade_map[grade] = int(total.replace(',', ''))

			# load user star data
			star_entry = soup.find('div', {'class': 'stars'})
			star_map = {}
			while star_entry.find_next('div', {'class': 'stars'}):
				star_entry = star_entry.find_next('div', {'class': 'stars'})
				star_imgs = star_entry.find_all('img', src='/Content/images/star.png')
				num_stars = len(star_imgs)
				star_count = star_entry.find_next('span', {'class': 'total'}).text.strip()
				star_map[num_stars] = int(star_count.replace(',', ''))

			# load user attempt data
			attempts_section = soup.find('div', {'id': 'chart'})
			attempts_chart = attempts_section.find_next('script').text.strip()
			chart_data = json.loads(attempts_chart.replace('kendo.syncReady(function(){jQuery("#chart").kendoChart(', '').replace(');});', ''))
			attempt_map = {}
			for entry in chart_data['series'][0]['data']:
				percentage = entry['value']
				attempts = entry['category']
				attempt_map[attempts] = percentage
			
			# update climb data
			climb['userGrades'] = grade_map
			climb['userStars'] = star_map
			climb['userAttempts'] = attempt_map
		with open(f"data/a_benchmarks-{holdset}-{angle}.json", 'w') as wfile:
			json.dump(benchmarks, wfile, indent='\t')
