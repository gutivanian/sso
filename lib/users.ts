// User management functions that connect to real database
// Import dari db.ts yang sudah terkoneksi ke PostgreSQL
import * as db from './db';
import bcrypt from 'bcryptjs';

// Re-export User type dari db
export type { User } from './db';

/**
 * Cari user berdasarkan email dari DATABASE
 */
export async function findUserByEmail(email: string): Promise<db.User | null> {
  console.log('[findUserByEmail] 🔍 Searching for email:', email);
  console.log('[findUserByEmail] Email type:', typeof email);
  console.log('[findUserByEmail] Email trimmed:', email?.trim());
  
  try {
    // Query ke database yang sebenarnya
    const user = await db.findUserByEmail(email);
    
    console.log('[findUserByEmail] Result:', user ? '✅ Found in DATABASE' : '❌ Not found');
    if (user) {
      console.log('[findUserByEmail] User details from DB:', { 
        id: user.id, 
        email: user.email,
        name: user.name,
        is_active: user.is_active,
        email_verified: user.email_verified
      });
    } else {
      console.log('[findUserByEmail] ⚠️ User not found in database');
    }
    
    return user;
  } catch (error) {
    console.error('[findUserByEmail] ❌ Database error:', error);
    throw error;
  }
}

/**
 * Validasi password menggunakan bcrypt
 */
export async function validatePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  console.log('[validatePassword] 🔐 Starting password validation');
  console.log('[validatePassword] Input password length:', password?.length);
  console.log('[validatePassword] Input password (first 3 chars):', password?.substring(0, 3) + '***');
  console.log('[validatePassword] Password type:', typeof password);
  console.log('[validatePassword] Hashed password (first 20 chars):', hashedPassword?.substring(0, 20) + '...');
  
  try {
    // Gunakan bcrypt untuk compare password dengan hash dari database
    const isValid = await bcrypt.compare(password, hashedPassword);
    
    if (isValid) {
      console.log('[validatePassword] ✅ Password MATCHED using bcrypt!');
    } else {
      console.log('[validatePassword] ❌ Password did NOT match');
      console.log('[validatePassword] Debug info:');
      console.log('  - Password provided length:', password.length);
      console.log('  - Hash format valid?', hashedPassword?.startsWith('$2a$') || hashedPassword?.startsWith('$2b$'));
    }
    
    return isValid;
  } catch (error) {
    console.error('[validatePassword] ❌ Bcrypt error:', error);
    return false;
  }
}

/**
 * Hash password menggunakan bcrypt (untuk registrasi user baru)
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
