create table if not exists contacts 
( 
    id SERIAL NOT NULL CONSTRAINT contacts_key PRIMARY KEY,
    name VARCHAR(254) not null,
    date_of_birth VARCHAR(24) not null,
    phone VARCHAR(24) not null,
    credit_card VARCHAR(254) not null,
    franchise VARCHAR(24) not null,
    email VARCHAR(64) not null,
    address VARCHAR(254) not null
);