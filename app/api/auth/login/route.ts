import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, validatePassword } from '@/lib/users';
import { updateUserLastLogin } from '@/lib/db';
import { signJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('========== LOGIN ATTEMPT ==========');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Email received:', email);
    console.log('Password received (first 3 chars):', password?.substring(0, 3) + '***');
    console.log('Password length:', password?.length);

    if (!email || !password) {
      console.log('❌ VALIDATION FAILED: Missing email or password');
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Cari user
    console.log('🔍 Searching for user with email:', email);
    const user = await findUserByEmail(email);
    if (!user) {
      console.log('❌ USER NOT FOUND:', email);
      console.log('⚠️ User might not exist or is inactive in database');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('✅ User found:', { id: user.id, email: user.email, name: user.name });

    // Validasi password
    console.log('🔐 Validating password...');
    const isValid = await validatePassword(password, user.password_hash);
    console.log('Password validation result:', isValid);
    if (!isValid) {
      console.log('❌ PASSWORD VALIDATION FAILED');
      console.log('Received password length:', password?.length);
      console.log('Password hash in DB (first 20 chars):', user.password_hash?.substring(0, 20) + '...');
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('✅ PASSWORD VALID');

    // Update last login timestamp
    console.log('📝 Updating last login timestamp...');
    await updateUserLastLogin(user.id);

    // Buat JWT token
    console.log('🎫 Creating JWT token for user:', user.email);
    const token = await signJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    console.log('✅ Token created successfully');

    // Set cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );

    response.cookies.set('sso_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('✅ LOGIN SUCCESSFUL');
    console.log('===================================\n');
    return response;
  } catch (error) {
    console.error('❌ LOGIN ERROR:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.log('===================================\n');
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
