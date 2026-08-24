import { NextResponse } from 'next/server';
import { getPosterCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';
import { INITIAL_POSTERS } from '@/lib/initialData';

export async function GET() {
  try {
    const collection = await getPosterCollection();
    const posters = await collection.find({}).toArray();
    if (posters.length === 0) {
      await collection.insertMany(INITIAL_POSTERS);
      return NextResponse.json(INITIAL_POSTERS);
    }
    return NextResponse.json(posters);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch posters' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { email } = (request as any).auth;
    const isAdminEmail = email === 'admin@finess.fashion' || email === 'admin@finesse.fashion';
    if (!isAdminEmail) {
      const users = await getUserCollection();
      const dbUser = await users.findOne({ email });
      if (!dbUser || !dbUser.isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const posters = await request.json();

    if (!Array.isArray(posters)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const collection = await getPosterCollection();
    await collection.deleteMany({});
    if (posters.length > 0) {
      await collection.insertMany(posters);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update posters' }, { status: 500 });
  }
}
