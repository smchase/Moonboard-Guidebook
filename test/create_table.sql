CREATE TABLE benchmarks_201640 (
	ID serial primary key,
	name varchar(100),
	setter varchar(100),
	official_grade integer,
	user_grade real,
	user_stars real,
	user_attempts real,
	repeats integer,
	upgraded boolean,
	downgraded boolean,
	holdsets varchar(100)[],
	date_created timestamp
);
