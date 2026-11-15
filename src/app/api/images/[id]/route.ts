import { NextRequest, NextResponse } from 'next/server';
import sqlite from '@/lib/data';

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  sqlite.prepare('DELETE FROM images WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
