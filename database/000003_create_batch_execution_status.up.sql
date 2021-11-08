create table if not exists batch_execution_status 
( 
    id VARCHAR(64) primary key not null,
    id_author integer not null constraint id_author_fkey references users,
    errors JSONB,
    size VARCHAR(11) not null,
    filename VARCHAR(254) not null,
    originalname VARCHAR(254) not null,
    started_at TIMESTAMPTZ not null,
    finished_at TIMESTAMPTZ,
    status VARCHAR(24) not null,
    additional_data JSONB DEFAULT NULL 
);