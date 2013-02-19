create table #prefix#scorm_data (
	id int not null primary key auto_increment,
	user int not null,
	ts datetime not null,
	module char(128) not null,
	datakey char(128) not null,
	value char(255) not null,
	unique (module, user, datakey),
	index (module, user, ts),
	index (module, datakey, ts)
);
