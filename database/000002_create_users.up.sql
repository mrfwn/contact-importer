create table if not exists users 
( 
    id SERIAL NOT NULL CONSTRAINT users_key PRIMARY KEY,
    email VARCHAR(64) not null,
    username VARCHAR(30) not null,
    password VARCHAR(254) not null
);