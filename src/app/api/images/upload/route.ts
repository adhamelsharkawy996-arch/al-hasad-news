import { NextRequest, NextResponse } from 'next/server';
import sqlite from '@/lib/data';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  
  const id = crypto.randomUUID();
  const url = `/uploads/${filename}`;
  sqlite.prepare('INSERT INTO images (id, filename, original_url) VALUES (?, ?, ?)').run(id, filename, url);
  
  return NextResponse.json({ id, url, filename });
}
