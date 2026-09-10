import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

export async function GET(request: Request) {
  try {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { userId, email, isAdmin } = (request as any).auth;
    const ordersCol = await getOrderCollection();

    const isAdminUser = isAdmin || email === 'admin@finess.fashion' || email === 'admin@finesse.fashion';
    if (isAdminUser) {
      const allOrders = await ordersCol.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ orders: allOrders }, { status: 200 });
    }

    const userOrders = await ordersCol.find({ userId }).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ orders: userOrders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
