import { NextResponse } from 'next/server';
import { getOrderCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

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

    const { orderId, orderStatus, courierName, awbNumber, estimatedDelivery, returnRequest, historyTimeline } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const ordersCol = await getOrderCollection();
    const existingOrder = await ordersCol.findOne({ id: orderId });
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateFields: any = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (courierName !== undefined) updateFields.courierName = courierName;
    if (awbNumber !== undefined) updateFields.awbNumber = awbNumber;
    if (estimatedDelivery !== undefined) updateFields.estimatedDelivery = estimatedDelivery;
    if (returnRequest !== undefined) updateFields.returnRequest = returnRequest;
    if (historyTimeline !== undefined) updateFields.historyTimeline = historyTimeline;

    await ordersCol.updateOne({ id: orderId }, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}
