import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    let userId = 'guest';

    // Verify authentication via Bearer JWT token
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = verifyToken(token);
        if (payload?.userId) {
          userId = payload.userId;
        }
      } catch {
        // Fallback to guest if token is invalid or expired
        userId = 'guest';
      }
    }

    const orderData = await request.json();
    if (!orderData || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain items' }, { status: 400 });
    }

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

