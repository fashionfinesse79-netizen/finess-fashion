import { NextResponse } from 'next/server';
import { getUserCollection, getOrderCollection } from '@/lib/mongodb';

/**
 * DELETE /api/clean-db
 * Removes every user that is NOT admin and deletes all orders.
 * Use **only** in development – never expose this in production!
 */
export async function DELETE() {
  try {
    const users = await getUserCollection();
    const orders = await getOrderCollection();

    // Delete all non‑admin users
    const userResult = await users.deleteMany({ isAdmin: { $ne: true } });
    // Delete all orders (you could keep admin orders if you wish)
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
