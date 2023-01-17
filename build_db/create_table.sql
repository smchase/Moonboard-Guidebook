CREATE TABLE benchmarks (
	ID serial primary key,
	mb_type integer,
	name varchar(100),
	setter varchar(100),
	official_grade integer,
	user_grade real,
	user_stars real,
	user_attempts real,
	repeats integer,
	upgraded boolean,
	downgraded boolean,
	holdsets integer[],
	date_created timestamp
);
