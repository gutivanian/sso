import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

// API untuk aplikasi lain mendapatkan user info dari SSO
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Dalam production, ambil dari database
    // const user = await db.users.findUnique({ where: { id: payload.id } });
    
    return NextResponse.json({
      user: {
        id: payload.id,  // Ini adalah UUID
        email: payload.email,
        name: payload.name,
        // Data lain yang diperlukan aplikasi
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
