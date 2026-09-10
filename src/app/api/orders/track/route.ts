import { NextResponse } from 'next/server';
import { getOrderCollection } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orders = await getOrderCollection();
    const q = id.trim();
    if (q.length > 120) {
      return NextResponse.json({ error: 'Invalid search query' }, { status: 400 });
    }

    // Escape regex special characters to prevent ReDoS and regex injection
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find order matching ID or tracking number safely
    const order = await orders.findOne({
      $or: [
        { id: q },
        { trackingNumber: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } },
        { awbNumber: { $regex: new RegExp(`^${escapedQuery}$`, 'i') } }
      ]
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to track order' }, { status: 500 });
  }
}
