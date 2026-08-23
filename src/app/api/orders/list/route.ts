import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const orders = await getOrderCollection();
    const userOrders = await orders.find({ userId }).toArray();
    return NextResponse.json({ orders: userOrders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
