import { NextResponse } from 'next/server';
import { getUserCollection, getOrderCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

/**
 * DELETE /api/clean-db
 * Removes every user that is NOT admin and deletes all orders.
 * Strictly blocked in production. Requires authenticated admin in development.
 */
export async function DELETE(request: Request) {
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint permanently disabled in production' }, { status: 403 });
  }

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

    const users = await getUserCollection();
    const orders = await getOrderCollection();

    // Delete all non‑admin users
    const userResult = await users.deleteMany({ isAdmin: { $ne: true } });
    // Delete all orders
    const orderResult = await orders.deleteMany({});

    return NextResponse.json({
      message: 'Database cleaned',
      deletedUsers: userResult.deletedCount,
      deletedOrders: orderResult.deletedCount,
    });
  } catch (err) {
    console.error('Clean‑db error:', err);
    return NextResponse.json({ error: 'Failed to clean DB' }, { status: 500 });
  }
}
