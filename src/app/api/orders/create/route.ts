import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const orderData: Omit<Order, 'userId'> = await request.json();
    const newOrder: Order = {
      ...orderData,
      userId,
      createdAt: new Date(),
    };
    const orders = await getOrderCollection();
    await orders.insertOne(newOrder as any);
    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
