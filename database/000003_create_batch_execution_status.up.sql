create table if not exists batch_execution_status 
( 
    id VARCHAR(30) primary key not null,
    author VARCHAR(254) not null,
    errors JSONB,
    size VARCHAR(11) not null,
    filename VARCHAR(254) not null,
    originalname VARCHAR(254) not null,
    started_at TIMESTAMPTZ not null,
    finished_at TIMESTAMPTZ,
    status VARCHAR(9) not null,
    additional_data JSONB DEFAULT NULL 
);