import { NextRequest, NextResponse } from 'next/server';
import sqlite from '@/lib/data';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const article = sqlite.prepare('SELECT * FROM articles WHERE id = ?').get(params.id);
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { title, slug, excerpt, content, featuredImage, categoryId, author, status, isBreaking, publishedAt, metaTitle, metaDescription } = body;
  
  sqlite.prepare(`UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?, category_id = ?, author = ?, status = ?, is_breaking = ?, published_at = ?, meta_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(
    title, slug, excerpt, content, featuredImage, categoryId, author, status, isBreaking ? 1 : 0, publishedAt, metaTitle, metaDescription, params.id
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  sqlite.prepare('DELETE FROM articles WHERE id = ?').run(params.id);
  return NextResponse.json({ success: true });
}
