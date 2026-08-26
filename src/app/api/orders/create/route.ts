import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    let userId = request.headers.get('x-user-id');

    // Token authentication fallback
    if (!userId) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const payload = verifyToken(token);
          userId = payload.userId;
        } catch (e) {
          console.error('Failed to verify token in orders/create:', e);
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData = await request.json();
    const newOrder = {
      ...orderData,
      userId,
      createdAt: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
    };

    const ordersCol = await getOrderCollection();
    const result = await ordersCol.insertOne(newOrder);

    return NextResponse.json({ success: true, orderId: result.insertedId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

