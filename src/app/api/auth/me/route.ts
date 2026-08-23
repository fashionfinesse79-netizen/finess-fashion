import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserCollection } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Admin bypass – always return admin user object
    if (decoded.email === 'admin@finess.fashion' || decoded.email === 'admin@finesse.fashion') {
      return NextResponse.json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          name: 'Admin',
          phone: '',
          addresses: [],
          savedWishlistIds: [],
          isAdmin: true,
        }
      }, { status: 200 });
    }

    const users = await getUserCollection();
    const dbUser = await users.findOne({ id: decoded.userId });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return user info, omit passwordHash
    const { passwordHash, ...safeUser } = dbUser;
    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    const { addresses } = await request.json();
    const users = await getUserCollection();
    
    await users.updateOne(
      { id: decoded.userId },
      { $set: { addresses: addresses || [] } }
    );
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 400 });
  }
}
