import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
const pgPool = new Pool({ connectionString });

export default pgPool;
