import { Pool } from 'pg';
import { 
    POSTGRES_DATABASE, 
    POSTGRES_HOST, 
    POSTGRES_PASSWORD, 
    POSTGRES_PORT, 
    POSTGRES_SSL, 
    POSTGRES_USER, 
    NODE_ENV 
} from '../../config/env';

const isSSLFlagActive = (SSL: string | undefined = '') => String(SSL.toLocaleLowerCase()) !== 'false';

export const db = new Pool({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    password: POSTGRES_PASSWORD,
    port: Number.parseInt(POSTGRES_PORT || '5432', 10),
    max: 100,
    ssl: isSSLFlagActive(POSTGRES_SSL)
});

NODE_ENV === 'test' && db.on('error', (err, client) => {});

export default db

