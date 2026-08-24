import { NextResponse } from 'next/server';
import { getCouponCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';
import { INITIAL_COUPONS } from '@/lib/initialData';

export async function GET() {
  try {
    const collection = await getCouponCollection();
    const coupons = await collection.find({}).toArray();
    if (coupons.length === 0) {
      await collection.insertMany(INITIAL_COUPONS);
      return NextResponse.json(INITIAL_COUPONS);
    }
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch coupons' }, { status: 500 });
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

    const coupons = await request.json();

    if (!Array.isArray(coupons)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const collection = await getCouponCollection();
    await collection.deleteMany({});
    if (coupons.length > 0) {
      await collection.insertMany(coupons);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update coupons' }, { status: 500 });
  }
}
