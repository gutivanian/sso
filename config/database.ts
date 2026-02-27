// Database configuration using postgres library
import postgres from 'postgres';

// Konfigurasi database dari environment variables
const sql = postgres({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sso_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT || undefined,
  } : false,
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
