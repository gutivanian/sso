// Database connection untuk SSO (PostgreSQL with UUID)
import postgres from 'postgres';

// Konfigurasi database dari environment variables
const dbConfig = {
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
};

const sql = postgres(dbConfig);

export interface User {
  id: string;  // UUID
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await sql<User[]>`
    SELECT * FROM users 
    WHERE email = ${email} 
    AND is_active = true
    LIMIT 1
  `;
  return users[0] || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await sql<User[]>`
    SELECT * FROM users 
    WHERE id = ${id}::uuid 
    AND is_active = true
    LIMIT 1
  `;
  return users[0] || null;
}

export async function createUser(data: {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
}): Promise<User> {
  const users = await sql<User[]>`
    INSERT INTO users (email, password_hash, name, phone)
    VALUES (${data.email}, ${data.password_hash}, ${data.name}, ${data.phone || null})
    RETURNING *
  `;
  return users[0];
}

export async function updateUserLastLogin(id: string): Promise<void> {
  await sql`
    UPDATE users 
    SET last_login_at = CURRENT_TIMESTAMP 
    WHERE id = ${id}::uuid
  `;
}

export async function validatePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(password, 10);
}

// Session management
export async function createSession(data: {
  user_id: string;
  token_hash: string;
  app_id: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
}) {
  await sql`
    INSERT INTO sessions (user_id, token_hash, app_id, ip_address, user_agent, expires_at)
    VALUES (
      ${data.user_id}::uuid, 
      ${data.token_hash}, 
      ${data.app_id}, 
      ${data.ip_address || null},
      ${data.user_agent || null},
      ${data.expires_at}
    )
  `;
}

export async function deleteExpiredSessions(): Promise<void> {
  await sql`
    DELETE FROM sessions 
    WHERE expires_at < CURRENT_TIMESTAMP
  `;
}

// Audit logging
export async function logAuditEvent(data: {
  user_id?: string;
  action: string;
  app_id?: string;
  ip_address?: string;
  details?: any;
}) {
  await sql`
    INSERT INTO audit_logs (user_id, action, app_id, ip_address, details)
    VALUES (
      ${data.user_id ? `${data.user_id}::uuid` : null},
      ${data.action},
      ${data.app_id || null},
      ${data.ip_address || null},
      ${data.details ? sql.json(data.details) : null}
    )
  `;
}

// ============================================
// REGISTERED APPS MANAGEMENT
// ============================================

export interface RegisteredApp {
  id: string;
  name: string;
  description?: string;
  dev_app_url: string;
  dev_callback_url: string;
  dev_allowed_origins: string[];
  prod_app_url?: string;
  prod_callback_url?: string;
  prod_allowed_origins?: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AppConfig {
  id: string;
  name: string;
  app_url: string;
  callback_url: string;
  allowed_origins: string[];
}

/**
 * Get current environment (development or production)
 */
export function getEnvironment(): 'development' | 'production' {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/**
 * Get all registered apps
 */
export async function getRegisteredApps(): Promise<RegisteredApp[]> {
  const apps = await sql<RegisteredApp[]>`
    SELECT * FROM registered_apps 
    WHERE is_active = true
    ORDER BY name
  `;
  return apps;
}

/**
 * Get app configuration berdasarkan environment (dev/prod)
 */
export async function getAppConfig(appId: string): Promise<AppConfig | null> {
  const apps = await sql<RegisteredApp[]>`
    SELECT * FROM registered_apps 
    WHERE id = ${appId} 
    AND is_active = true
    LIMIT 1
  `;
  
  if (apps.length === 0) {
    console.log(`[getAppConfig] App not found: ${appId}`);
    return null;
  }

  const app = apps[0];
  const env = getEnvironment();
  
  console.log(`[getAppConfig] Loading config for app: ${appId}, environment: ${env}`);

  // Pilih URL berdasarkan environment
  const config: AppConfig = {
    id: app.id,
    name: app.name,
    app_url: env === 'production' ? (app.prod_app_url || app.dev_app_url) : app.dev_app_url,
    callback_url: env === 'production' ? (app.prod_callback_url || app.dev_callback_url) : app.dev_callback_url,
    allowed_origins: env === 'production' ? (app.prod_allowed_origins || app.dev_allowed_origins) : app.dev_allowed_origins,
  };

  console.log(`[getAppConfig] Config loaded:`, {
    app_url: config.app_url,
    callback_url: config.callback_url,
    allowed_origins: config.allowed_origins,
  });

  return config;
}

/**
 * Get all allowed origins untuk semua apps (untuk CORS)
 */
export async function getAllAllowedOrigins(): Promise<string[]> {
  const apps = await getRegisteredApps();
  const env = getEnvironment();
  
  const origins = new Set<string>();
  
  for (const app of apps) {
    const appOrigins = env === 'production' 
      ? (app.prod_allowed_origins || app.dev_allowed_origins) 
      : app.dev_allowed_origins;
    
    appOrigins.forEach(origin => origins.add(origin));
  }
  
  const result = Array.from(origins);
  console.log(`[getAllAllowedOrigins] Environment: ${env}, Origins:`, result);
  
  return result;
}

/**
 * Update app URLs (untuk admin panel nanti)
 */
export async function updateAppUrls(appId: string, data: {
  dev_app_url?: string;
  dev_callback_url?: string;
  dev_allowed_origins?: string[];
  prod_app_url?: string;
  prod_callback_url?: string;
  prod_allowed_origins?: string[];
}): Promise<void> {
  const updates: any = {
    updated_at: sql`CURRENT_TIMESTAMP`,
  };

  if (data.dev_app_url) updates.dev_app_url = data.dev_app_url;
  if (data.dev_callback_url) updates.dev_callback_url = data.dev_callback_url;
  if (data.dev_allowed_origins) updates.dev_allowed_origins = data.dev_allowed_origins;
  if (data.prod_app_url) updates.prod_app_url = data.prod_app_url;
  if (data.prod_callback_url) updates.prod_callback_url = data.prod_callback_url;
  if (data.prod_allowed_origins) updates.prod_allowed_origins = data.prod_allowed_origins;

  await sql`
    UPDATE registered_apps 
    SET ${sql(updates)}
    WHERE id = ${appId}
  `;
  
  console.log(`[updateAppUrls] Updated app: ${appId}`);
}

export default sql;
