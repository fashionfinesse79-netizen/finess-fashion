import { NextResponse } from 'next/server';
import { getVideoCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

export async function GET() {
  try {
    const collection = await getVideoCollection();
    const videos = await collection.find({}).toArray();
    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch videos' }, { status: 500 });
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

    const videos = await request.json();

    if (!Array.isArray(videos)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const collection = await getVideoCollection();
    await collection.deleteMany({});
    if (videos.length > 0) {
      await collection.insertMany(videos);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update videos' }, { status: 500 });
  }
}
