// Script untuk update production URLs PFTU
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
        value = value.substring(1);
        
        // Check if it ends with quote (single line)
        if (value.endsWith('"')) {
          env[currentKey] = value.slice(0, -1);
        } else {
          // Multi-line value
          inMultiline = true;
          currentValue = [value];
        }
      } else {
        env[currentKey] = value;
      }
    } else if (inMultiline) {
      // Continue collecting multi-line value
      if (line.endsWith('"')) {
        currentValue.push(line.slice(0, -1));
        env[currentKey] = currentValue.join('\n');
        inMultiline = false;
        currentValue = [];
      } else {
        currentValue.push(line);
      }
    }
  });
  
  return env;
}

const env = loadEnv();

const sql = postgres({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT),
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.DB_SSL === 'true' ? { ca: env.DB_CA_CERT } : false
});

async function updatePFTU() {
  try {
    console.log('🔄 Updating PFTU production URLs...');
    
    const result = await sql`
      UPDATE registered_apps 
      SET 
        prod_app_url = 'https://fintrack-gutivanian.vercel.app',
        prod_callback_url = 'https://fintrack-gutivanian.vercel.app/auth/callback',
        prod_allowed_origins = ARRAY['https://fintrack-gutivanian.vercel.app'],
        updated_at = NOW()
      WHERE id = 'pftu'
      RETURNING *
    `;
    
    if (result.length > 0) {
      console.log('\n✅ Production URLs updated successfully!\n');
      console.log('App ID:', result[0].id);
      console.log('Name:', result[0].name);
      console.log('\n📍 Development URLs:');
      console.log('  App URL:', result[0].dev_app_url);
      console.log('  Callback:', result[0].dev_callback_url);
      console.log('  Origins:', result[0].dev_allowed_origins);
      console.log('\n🚀 Production URLs:');
      console.log('  App URL:', result[0].prod_app_url);
      console.log('  Callback:', result[0].prod_callback_url);
      console.log('  Origins:', result[0].prod_allowed_origins);
      console.log('\n⏰ Updated at:', result[0].updated_at);
    } else {
      console.log('❌ PFTU app not found in database');
    }
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await sql.end();
    process.exit(1);
  }
}

updatePFTU();
