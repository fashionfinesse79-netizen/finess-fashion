import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

/**
 * GET /api/orders
 * Returns the list of orders belonging to the authenticated user.
 */
export async function GET(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const { userId, email } = (request as any).auth;

  const ordersCol = await getOrderCollection();

  // Admin bypass: let the store owner see all orders
  const isAdminEmail = email === 'admin@finess.fashion' || email === 'admin@finesse.fashion';
  if (isAdminEmail) {
    const allOrders = await ordersCol.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ orders: allOrders });
  }

  const orders = await ordersCol.find({ userId }).toArray();
  return NextResponse.json({ orders });
}


/**
 * POST /api/orders
 * Creates a new order for the authenticated user.
 * Expected body: { items: [{ productId, quantity, price }], total }
 */
export async function POST(request: Request) {
  const authError = await requireAuth(request);
  if (authError) return authError;
  const { userId } = (request as any).auth;
  const { items, total } = await request.json();

  const newOrder = {
    userId,
    items,
    total,
    createdAt: new Date(),
    status: 'pending' as const,
  };

  const ordersCol = await getOrderCollection();
  const result = await ordersCol.insertOne(newOrder);
  return NextResponse.json({ orderId: result.insertedId }, { status: 201 });
}
