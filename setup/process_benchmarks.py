import json
from mb_types import mb_types

enumerate_grades = {
	"5+": 0,
	"6A": 1,
	"6A+": 2,
	"6B": 3,
	"6B+": 4,
	"6C": 5,
	"6C+": 6,
	"7A": 7,
	"7A+": 8,
	"7B": 9,
	"7B+": 10,
	"7C": 11,
	"7C+": 12,
	"8A": 13,
	"8A+": 14,
	"8B": 15,
	"8B+": 16,
	"8C": 17,
}
enumerate_attempts = {
	"Flashed": 0,
	"2nd try": 1,
	"3rd try": 2,
	"more than 3 tries": 3,
}
enumerate_mb = {
	"2016-40": 0,
	"2017-25": 1,
	"2017-40": 2,
	"2019-25": 3,
	"2019-40": 4,
	"2020-40": 5,
}
enumerate_holdsets = {
	"Original School Holds": 0,
	"Hold Set A": 1,
	"Hold Set B": 2,
	"Hold Set C": 3,
	"Wooden Holds": 4,
	"Wooden Holds B": 5,
	"Wooden Holds C": 6,
}

for mb in mb_types:
	print(f"Processing {mb} benchmarks")
	p_benchmarks = [] 
	with open(f"data/augmented_{mb}.json", "r") as rfile:
		benchmarks = json.load(rfile)
		for climb in benchmarks:
			if climb["userGrades"] == {}:
				avg_user_grade = enumerate_grades[climb["grade"]]
			else:
				user_grade_sum = 0
				user_grade_breakdown = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
				for grade in climb["userGrades"]:
					user_grade_sum += climb["userGrades"][grade] * enumerate_grades[grade]
					user_grade_breakdown[enumerate_grades[grade]] = climb["userGrades"][grade]
				avg_user_grade = user_grade_sum / sum(climb["userGrades"].values())

			if climb["userStars"] == {}:
				avg_user_star = 0
			else:
				user_star_sum = 0
				user_star_breakdown = [0, 0, 0, 0, 0, 0]
				for star in climb["userStars"]:
					user_star_sum += climb["userStars"][star] * int(star)
					user_star_breakdown[int(star)] = climb["userStars"][star]
				avg_user_star = user_star_sum / sum(climb["userStars"].values())

			if climb["userAttempts"] == {}:
				avg_user_attempts = 0
			else:
				user_attempts_sum = 0
				user_attempts_breakdown = [0, 0, 0, 0]
				for attempts in climb["userAttempts"]:
					user_attempts_sum += climb["userAttempts"][attempts] * (enumerate_attempts[attempts]+1)
					user_attempts_breakdown[enumerate_attempts[attempts]] = climb["userAttempts"][attempts]
				avg_user_attempts = user_attempts_sum / sum(climb["userAttempts"].values())

			holdsets = []
			for hs in climb["holdsets"]:
				holdsets.append(enumerate_holdsets[hs["description"]])
			
			start_holds = []
			mid_holds = []
			end_holds = []
			for hold in climb["moves"]:
				if hold["isStart"]:
					start_holds.append(hold["description"])
				elif hold["isEnd"]:
					end_holds.append(hold["description"])
				else:
					mid_holds.append(hold["description"])

			date = climb["dateInserted"][:19]
			date = date.replace("T", " ")

			p_climb = {
				"id": climb["apiId"],
				"mb_type": enumerate_mb[mb],

				"name": climb["name"],
				"setter": climb["setby"],
				"grade": enumerate_grades[climb["grade"]],
				"upgraded": climb["upgraded"],
				"downgraded": climb["downgraded"],
				"repeats": climb["repeats"],
				"date_created": date,

				"holdsets": holdsets,
				"start_holds": start_holds,
				"mid_holds": mid_holds,
				"end_holds": end_holds,

				"avg_user_grade": round(avg_user_grade, 4),
				"user_grade_breakdown": user_grade_breakdown,

				"avg_user_stars": round(avg_user_star, 3),
				"user_stars_breakdown": user_star_breakdown,

				"avg_user_attempts": round(avg_user_attempts, 3),
				"user_attempts_breakdown": user_attempts_breakdown,
			}
			p_benchmarks.append(p_climb)
	with open(f"data/processed_{mb}.json", "w") as wfile:
		json.dump(p_benchmarks, wfile, indent="\t")
