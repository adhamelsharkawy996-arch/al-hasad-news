import { NextRequest, NextResponse } from 'next/server';
import sqlite from '@/lib/data';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  sqlite.prepare('DELETE FROM images WHERE id = ?').run(params.id);
  return NextResponse.json({ success: true });
}
