import { NextResponse } from 'next/server';
import { removeUserCookie } from '@/lib/auth';

export async function POST() {
  await removeUserCookie();
  return NextResponse.json({ success: true });
}
