import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    await register(email, password, name);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
