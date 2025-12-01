import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/db-utils';

export async function GET() {
  try {
    const userId = getOrCreateUserId();
    return NextResponse.json({ userId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get user ID' }, { status: 500 });
  }
}

