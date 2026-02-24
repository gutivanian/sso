// Script untuk register PFTU app di SSO database
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Load .env manually
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  let currentKey = null;
  let currentValue = [];
  let inMultiline = false;
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) {
      if (!inMultiline) return;
    }
    
    // Check if this is a key=value line
    if (line.includes('=') && !inMultiline) {
      const [key, ...valueParts] = line.split('=');
      currentKey = key.trim();
      let value = valueParts.join('=').trim();
      
      // Check if value starts with quote
      if (value.startsWith('"')) {
        if (value.endsWith('"') && value.length > 1) {
          // Single line quoted value
          env[currentKey] = value.slice(1, -1);
          currentKey = null;
        } else {
          // Start of multiline
          inMultiline = true;
          currentValue = [value.slice(1)];
        }
      } else {
        env[currentKey] = value;
        currentKey = null;
      }
    } else if (inMultiline) {
      // Accumulate multiline value
      if (line.endsWith('"')) {
        currentValue.push(line.slice(0, -1));
        env[currentKey] = currentValue.join('\n');
        inMultiline = false;
        currentKey = null;
        currentValue = [];
      } else {
        currentValue.push(line);
      }
    }
  });
  
  return env;
}

const env = loadEnv();

function getSSL() {
  if (env.DB_SSL !== 'true') return false;
  return {
    rejectUnauthorized: true,
    ca: env.DB_CA_CERT
  };
}

const sql = postgres({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: getSSL(),
});

async function registerPFTU() {
  try {
    console.log('🔌 Connecting to SSO database...');
    console.log('✅ Connected!');
    
    // Check if PFTU already registered
    const check = await sql`
      SELECT * FROM registered_apps WHERE id = 'pftu'
    `;
    
    if (check.length > 0) {
      console.log('\n✅ PFTU already registered!');
      console.log('📝 Current configuration:');
      const app = check[0];
      console.log(`  App Name: ${app.name}`);
      console.log(`  Dev URL: ${app.dev_app_url}`);
      console.log(`  Dev Callback: ${app.dev_callback_url}`);
      console.log(`  Prod URL: ${app.prod_app_url || '(not set)'}`);
      console.log(`  Prod Callback: ${app.prod_callback_url || '(not set)'}`);
      
      // Update jika perlu
      console.log('\n🔄 Updating URLs to ensure they are correct...');
      await sql`
        UPDATE registered_apps 
        SET 
          dev_app_url = 'http://localhost:3002',
          dev_callback_url = 'http://localhost:3002/auth/callback',
          dev_allowed_origins = ARRAY['http://localhost:3002'],
          prod_app_url = 'https://pftu.yourdomain.com',
          prod_callback_url = 'https://pftu.yourdomain.com/auth/callback',
          prod_allowed_origins = ARRAY['https://pftu.yourdomain.com'],
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 'pftu'
      `;
      console.log('✅ URLs updated!');
    } else {
      console.log('\n➕ Registering PFTU app...');
      await sql`
        INSERT INTO registered_apps (
          id, 
          name, 
          description,
          dev_app_url,
          dev_callback_url,
          dev_allowed_origins,
          prod_app_url,
          prod_callback_url,
          prod_allowed_origins,
          is_active
        ) VALUES (
          'pftu',
          'Personal Finance Tracker',
          'Aplikasi untuk mengelola keuangan pribadi',
          'http://localhost:3002',
          'http://localhost:3002/auth/callback',
          ARRAY['http://localhost:3002'],
          'https://pftu.yourdomain.com',
          'https://pftu.yourdomain.com/auth/callback',
          ARRAY['https://pftu.yourdomain.com'],
          true
        )
      `;
      console.log('✅ PFTU registered!');
    }
    
    // Show all registered apps
    console.log('\n📋 All registered apps:');
    const apps = await sql`SELECT id, name, is_active FROM registered_apps ORDER BY created_at`;
    apps.forEach(app => {
      const status = app.is_active ? '✅' : '❌';
      console.log(`  ${status} ${app.id}: ${app.name}`);
    });
    
    console.log('\n✨ PFTU is now registered in SSO!');
    console.log('\n💡 Next steps:');
    console.log('  1. Start SSO-Auth: cd sso-auth && npm run dev (port 3001)');
    console.log('  2. Start PFTU: cd pftu && npm run dev (port 3002)');
    console.log('  3. Go to http://localhost:3002/login');
    console.log('  4. Click "Login dengan SSO"');
    console.log('  5. Login at SSO page and get redirected back to PFTU');
    
  } catch (error) {
    console.error('\n❌ Registration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
    console.log('\n🔌 Disconnected from database');
  }
}

console.log('='.repeat(60));
console.log('🔧 Register PFTU App in SSO Database');
console.log('='.repeat(60));
registerPFTU();
