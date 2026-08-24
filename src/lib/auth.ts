import { User } from '@/models/User';
import { getUserCollection } from '@/lib/mongodb';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { sendResetEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

/** Register a new user */
export async function register(email: string, password: string, name?: string) {
  const users = await getUserCollection();
  const existing = await users.findOne({ email });
  if (existing) {
    throw new Error('User already exists');
  }
  const passwordHash = await hash(password, 10);
  const isAdmin = email.trim() === 'admin@finess.fashion' || email.trim() === 'admin@finesse.fashion';
  const newUser: User = {
    id: uuidv4(),
    email,
    passwordHash,
    name: name || email.split('@')[0],
    phone: '',
    addresses: [],
    savedWishlistIds: [],
    isAdmin,
  };
  await users.insertOne(newUser);
  return { success: true };
}

// Hardcoded admin credentials (dev fallback – change in production)
const ADMIN_EMAIL = 'admin@finess.fashion';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_ID = '00000000-0000-0000-0000-000000000001';

/** Login and return JWT */
export async function login(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase();

  // Admin bypass – always works even if DB is empty
  if (trimmedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ userId: ADMIN_ID, email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
    return { token };
  }

  const users = await getUserCollection();
  const user = await users.findOne({ email: trimmedEmail });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token };
}

/** Generate password reset token and store */
export async function generateResetToken(email: string) {
  const users = await getUserCollection();
  const user = await users.findOne({ email });
  if (!user) {
    // For security, we don't reveal existence
    return { success: true };
  }
  const resetToken = uuidv4();
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await users.updateOne({ email }, { $set: { resetToken, resetTokenExpiry: expiry } });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
  try {
    await sendResetEmail(email, resetUrl);
  } catch (error) {
    console.error('Failed to send reset email:', error);
  }
  return { success: true };
}

/** Reset password using token */
export async function resetPassword(token: string, newPassword: string) {
  const users = await getUserCollection();
  const user = await users.findOne({ resetToken: token });
  if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    throw new Error('Invalid or expired token');
  }
  const passwordHash = await hash(newPassword, 10);
  await users.updateOne({ resetToken: token }, { $set: { passwordHash }, $unset: { resetToken: '', resetTokenExpiry: '' } });
  return { success: true };
}

/** Verify JWT and return payload */
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
