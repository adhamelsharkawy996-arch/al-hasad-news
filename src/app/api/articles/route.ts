import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import sqlite from '@/lib/data';
import { generateId, slugify } from '@/lib/utils';
import { getAllArticles } from '@/lib/data';

export async function GET(request: NextRequest) {
  const articles = getAllArticles({ status: 'published' });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const body = await request.json();
  const { title, slug, excerpt, content, featuredImage, categoryId, author, status, isBreaking, publishedAt, metaTitle, metaDescription } = body;
  
  const id = generateId();
  const finalSlug = slug || slugify(title);
  
  sqlite.prepare(`INSERT INTO articles (id, title, slug, excerpt, content, featured_image, category_id, author, status, is_breaking, published_at, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, title, finalSlug, excerpt, content, featuredImage, categoryId, author, status || 'published', isBreaking ? 1 : 0, publishedAt || new Date().toISOString(), metaTitle || title, metaDescription || excerpt
  );
  
  return NextResponse.json({ id, slug: finalSlug });
}
