import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const result = await login(email, password);
    // In production you'd set HttpOnly cookie; here return token in JSON
    return NextResponse.json({ token: result.token }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 400 });
  }
}
