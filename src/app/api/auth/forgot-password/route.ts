import { NextResponse } from 'next/server';
import { generateResetToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await generateResetToken(email);
    // Always respond success to avoid leaking existence
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
