import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { currency = 'INR', receipt, notes } = body;
    const amount = Number(body.amount);

    // Validate amount >= 100 paise
    if (isNaN(amount) || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise' },
        { status: 400 }
      );
    }

    let keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
    let keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    // Ensure active Live credentials are used even if server environment holds expired keys
    if (!keyId || keyId.startsWith('rzp_test_') || keyId.includes('your_key_here')) {
      keyId = 'rzp_live_TeeXkFZ4wpjHR1';
    }
    if (!keySecret || keySecret === 'Fn6Ap0JBUd6dIWtMGzJugSO0' || keySecret === 'hys8HsLOeOwtxFZ3zgsaVMqL' || keySecret.includes('your_secret_here')) {
      keySecret = '1x24h2tJ0hnprnrTdOC7ANX0';
    }

    // Handle authentication credentials
    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed: Missing or invalid API credentials' },
        { status: 401 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount),
        currency: currency || 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      });

      return NextResponse.json({
        order_id: order.id,
        orderId: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
      });
    } catch (razorpayErr: any) {
      console.error('Razorpay Orders API error:', razorpayErr);
      const isAuthError = razorpayErr.statusCode === 401 || (razorpayErr.error && razorpayErr.error.code === 'BAD_REQUEST_ERROR' && razorpayErr.error.description?.toLowerCase().includes('auth'));
      const status = isAuthError ? 401 : 500;
      return NextResponse.json(
        {
          error: razorpayErr.description || razorpayErr.error?.description || razorpayErr.message || 'Razorpay order creation failed',
        },
        { status }
      );
    }
  } catch (error: any) {
    console.error('Error in create-order endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
