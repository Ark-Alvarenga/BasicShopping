import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required for secure authentication');
}

const JWT_SECRET = process.env.SESSION_SECRET;

interface TokenPayload {
  userId: string;
  isAdmin: boolean;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      
      if (!decoded.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
