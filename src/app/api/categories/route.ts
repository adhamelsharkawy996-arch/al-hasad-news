import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import sqlite from '@/lib/data';

export async function GET() {
  const categories = sqlite.prepare('SELECT * FROM categories ORDER BY sort_order, name').all();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { name, slug, description } = await request.json();
  const id = crypto.randomUUID();
  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
  
  sqlite.prepare('INSERT INTO categories (id, name, slug, description) VALUES (?, ?, ?, ?)').run(id, name, finalSlug, description);
  return NextResponse.json({ id, slug: finalSlug });
}
