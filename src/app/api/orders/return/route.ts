import { NextResponse } from 'next/server';
import { getOrderCollection, getUserCollection } from '@/lib/mongodb';
import { requireAuth } from '@/lib/authMiddleware';

// POST: Customer requests a return
export async function POST(request: Request) {
  try {
    const { orderId, reason } = await request.json();

    if (!orderId || !reason) {
      return NextResponse.json({ error: 'Order ID and reason are required' }, { status: 400 });
    }

    const ordersCol = await getOrderCollection();
    const order = await ordersCol.findOne({ id: orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order is delivered
    if (order.orderStatus !== 'Delivered') {
      return NextResponse.json({ error: 'Only delivered orders can be returned' }, { status: 400 });
    }

    // Return request payload
    const returnRequest = {
      reason,
      status: 'Requested',
      requestedAt: new Date().toISOString(),
    };

    // Update order with the return request
    await ordersCol.updateOne(
      { id: orderId },
      { 
        $set: { returnRequest },
        $push: {
          historyTimeline: {
            status: order.orderStatus,
            timestamp: new Date().toLocaleString(),
            description: `Return requested. Reason: ${reason}`
          }
        } as any
      }
    );

    return NextResponse.json({ success: true, returnRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to request return' }, { status: 500 });
  }
}

// PUT: Admin updates return request status & notes
export async function PUT(request: Request) {
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

    const { orderId, status, adminNotes } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Order ID and return status are required' }, { status: 400 });
    }

    const ordersCol = await getOrderCollection();
    const order = await ordersCol.findOne({ id: orderId });

    if (!order || !order.returnRequest) {
      return NextResponse.json({ error: 'Order or return request not found' }, { status: 404 });
    }

    const updatedReturnRequest = {
      ...order.returnRequest,
      status,
      adminNotes: adminNotes !== undefined ? adminNotes : order.returnRequest.adminNotes,
      updatedAt: new Date().toISOString(),
    };

    await ordersCol.updateOne(
      { id: orderId },
      { 
        $set: { returnRequest: updatedReturnRequest },
        $push: {
          historyTimeline: {
            status: order.orderStatus,
            timestamp: new Date().toLocaleString(),
            description: `Return request status updated to ${status}. Notes: ${adminNotes || 'None'}`
          }
        } as any
      }
    );

    return NextResponse.json({ success: true, returnRequest: updatedReturnRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update return request' }, { status: 500 });
  }
}
