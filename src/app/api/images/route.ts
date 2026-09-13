import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import sqlite from '@/lib/data';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const images = sqlite.prepare('SELECT * FROM images ORDER BY created_at DESC').all();
  return NextResponse.json(images);
}
