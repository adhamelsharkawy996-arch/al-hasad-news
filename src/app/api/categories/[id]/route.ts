import { NextRequest, NextResponse } from 'next/server';
import sqlite from '@/lib/data';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { name, slug, description } = await request.json();
  sqlite.prepare('UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?').run(name, slug, description, params.id);
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  sqlite.prepare('DELETE FROM categories WHERE id = ?').run(params.id);
  return NextResponse.json({ success: true });
}
