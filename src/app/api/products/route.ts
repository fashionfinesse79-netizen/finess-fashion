import { NextResponse } from 'next/server';
import { getProductCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';
import { INITIAL_PRODUCTS } from '@/lib/initialData';

export async function GET() {
  try {
    const collection = await getProductCollection();
    const products = await collection.find({}).toArray();
    if (products.length === 0) {
      await collection.insertMany(INITIAL_PRODUCTS);
      return NextResponse.json(INITIAL_PRODUCTS);
    }
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
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

    const products = await request.json();

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const collection = await getProductCollection();
    await collection.deleteMany({});
    if (products.length > 0) {
      await collection.insertMany(products);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update products' }, { status: 500 });
  }
}
