import json
from mb_types import mb_types

enumerate_grades = {
	'5+': 0,
	'6A': 1,
	'6A+': 2,
	'6B': 3,
	'6B+': 4,
	'6C': 5,
	'6C+': 6,
	'7A': 7,
	'7A+': 8,
	'7B': 9,
	'7B+': 10,
	'7C': 11,
	'7C+': 12,
	'8A': 13,
	'8A+': 14,
	'8B': 15,
	'8B+': 16,
	'8C': 17,
}
enumerate_attempts = {
	'Flashed': 1,
	'2nd try': 2,
	'3rd try': 3,
	'more than 3 tries': 4,
}

for holdset, angle in mb_types:
	p_benchmarks = [] 
	with open(f"data/a_benchmarks-{holdset}-{angle}.json", 'r') as rfile:
		benchmarks = json.load(rfile)
		for climb in benchmarks:
			user_grade_sum = 0
			user_grade_breakdown = {
				0: 0,
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
				6: 0,
				7: 0,
				8: 0,
				9: 0,
				10: 0,
				11: 0,
				12: 0,
				13: 0,
				14: 0,
				15: 0,
				16: 0,
				17: 0
			}
			for grade in climb['userGrades']:
				user_grade_sum += climb['userGrades'][grade] * enumerate_grades[grade]
				user_grade_breakdown[enumerate_grades[grade]] = climb['userGrades'][grade]
			avg_user_grade = user_grade_sum / sum(climb['userGrades'].values())

			user_star_sum = 0
			user_star_breakdown = {
				0: 0,
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0
			}
			for star in climb['userStars']:
				user_star_sum += climb['userStars'][star] * int(star)
				user_star_breakdown[int(star)] = climb['userStars'][star]
			avg_user_star = user_star_sum / sum(climb['userStars'].values())

			user_attempts_sum = 0
			user_attempts_breakdown = {
				1: 0,
				2: 0,
				3: 0,
				4: 0
			}
			for attempts in climb['userAttempts']:
				user_attempts_sum += climb['userAttempts'][attempts] * enumerate_attempts[attempts]
				user_attempts_breakdown[enumerate_attempts[attempts]] = climb['userAttempts'][attempts]
			avg_user_attempts = user_attempts_sum / sum(climb['userAttempts'].values())

			holdsets = []
			for hs in climb['holdsets']:
				holdsets.append(hs['description'])
			
			start_holds = []
			mid_holds = []
			end_holds = []
			for hold in climb['moves']:
				if hold['isStart']:
					start_holds.append(hold['description'])
				elif hold['isEnd']:
					end_holds.append(hold['description'])
				else:
					mid_holds.append(hold['description'])

			p_climb = {
				'name': climb['name'],
				'setter': climb['setby'],
				'official_grade': enumerate_grades[climb['grade']],
				'user_grade': avg_user_grade,
				'user_stars': avg_user_star,
				'user_attempts': avg_user_attempts,
				'repeats': climb['repeats'],
				'upgraded': climb['upgraded'],
				'downgraded': climb['downgraded'],
				'holdsets': holdsets,
				'date_created': climb['dateInserted'],
				'holds': {
					'start': start_holds,
					'mid': mid_holds,
					'end': end_holds,
				},
				'user_grade_breakdown': user_grade_breakdown,
				'user_star_breakdown': user_star_breakdown,
				'user_attempts_breakdown': user_attempts_breakdown
			}
			p_benchmarks.append(p_climb)
	with open(f"data/p_benchmarks-{holdset}-{angle}.json", 'w') as wfile:
		json.dump(p_benchmarks, wfile, indent='\t')
