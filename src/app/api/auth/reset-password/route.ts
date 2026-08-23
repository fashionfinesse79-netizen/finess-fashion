import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();
    await resetPassword(token, newPassword);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Reset failed' }, { status: 400 });
  }
}
