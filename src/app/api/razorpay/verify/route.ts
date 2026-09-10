import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment identifiers' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Handle mock order flow if keys are pending configuration
    if (razorpay_order_id.startsWith('order_mock_') || !keySecret || keySecret.includes('your_secret_here')) {
      return NextResponse.json({
        verified: true,
        isMock: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    if (!razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment signature' }, { status: 400 });
    }

    // Verify HMAC SHA256 signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret.trim())
      .update(body)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const actualBuffer = Buffer.from(razorpay_signature, 'utf-8');

    if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      return NextResponse.json({ error: 'Invalid payment signature verification failed' }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      isMock: false,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment signature:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
