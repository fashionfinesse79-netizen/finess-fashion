import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Middleware to ensure the request has a valid Bearer JWT.
 * On success, attaches the decoded payload to `request.auth` for downstream handlers.
 */
export async function requireAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    // Attach payload to request for later use
    (request as any).auth = payload;
    return null; // No error
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
