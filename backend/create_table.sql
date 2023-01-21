CREATE TABLE benchmarks (
	id integer primary key,
	mb_type integer,

	name varchar(100),
	setter varchar(100),
	grade integer,
	upgraded boolean,
	downgraded boolean,
	repeats integer,
	date_created timestamp,

	holdsets integer[],
	start_holds varchar(3)[],
	mid_holds varchar(3)[],
	end_holds varchar(3)[],

	avg_user_grade real,
	sandbag_score real GENERATED ALWAYS AS (avg_user_grade - grade) STORED,
	user_grade_breakdown integer[],

	avg_user_stars real,
	user_stars_breakdown integer[],

	avg_user_attempts real,
	user_attempts_breakdown integer[]
);
