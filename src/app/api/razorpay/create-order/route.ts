import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR', receipt, notes } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // If keys are not configured yet, return friendly mock indicator
    if (!keyId || !keySecret || keyId.includes('your_key_here') || keySecret.includes('your_secret_here')) {
      return NextResponse.json({
        isMock: true,
        orderId: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency,
        keyId: null,
      });
    }

    // Call official Razorpay Orders API
    const authHeader = 'Basic ' + Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString('base64');
    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Razorpay Orders API error:', res.status, errText);
      return NextResponse.json({ error: 'Failed to create Razorpay order', details: errText }, { status: 502 });
    }

    const razorpayOrder = await res.json();
    return NextResponse.json({
      isMock: false,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: keyId.trim(),
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
