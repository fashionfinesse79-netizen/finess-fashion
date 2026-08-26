import { NextResponse } from 'next/server';
import { getInstagramCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

const INITIAL_INSTAGRAM = [
  {
    id: 'insta-1',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insta-2',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insta-3',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insta-4',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insta-5',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  },
  {
    id: 'insta-6',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    postUrl: 'https://instagram.com/finessefashion.co',
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const collection = await getInstagramCollection();
    let posts = await collection.find({}).toArray();
    if (posts.length === 0) {
      await collection.insertMany(INITIAL_INSTAGRAM);
      posts = await collection.find({}).toArray();
    }
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch instagram feed' }, { status: 500 });
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

    const posts = await request.json();

    if (!Array.isArray(posts)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const collection = await getInstagramCollection();
    await collection.deleteMany({});
    if (posts.length > 0) {
      await collection.insertMany(posts);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update instagram feed' }, { status: 500 });
  }
}
