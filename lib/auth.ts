import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required for secure authentication');
}

const JWT_SECRET = process.env.SESSION_SECRET;

interface TokenPayload {
  userId: string;
  isAdmin: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function setUserCookie(userId: string, isAdmin: boolean) {
  const cookieStore = await cookies();
  
  const token = jwt.sign(
    { userId, isAdmin } as TokenPayload,
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function removeUserCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
