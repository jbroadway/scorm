create sequence #prefix#scorm_id_seq;

create table #prefix#scorm_data (
	id integer not null default nextval('#prefix#scorm_id_seq') primary key,
	user int not null,
	ts datetime not null,
	module char(128) not null,
	datakey char(128) not null,
	value char(255) not null
);

create unique index #prefix#scorm_unique on #prefix#scorm_data (module, user, datakey);
create index #prefix#scorm_users on #prefix#scorm_data (module, user, ts);
create index #prefix#scorm_keys on #prefix#scorm_data (module, datakey, ts);
