import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'news.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  categoryId: string | null;
  author: string | null;
  status: string;
  isBreaking: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

function mapRow(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    featuredImage: row.featured_image ?? row.featuredImage ?? null,
    categoryId: row.category_id ?? row.categoryId ?? null,
    author: row.author,
    status: row.status,
    isBreaking: !!(row.is_breaking ?? row.isBreaking),
    publishedAt: row.published_at ?? row.publishedAt ?? null,
    scheduledAt: row.scheduled_at ?? row.scheduledAt ?? null,
    metaTitle: row.meta_title ?? row.metaTitle ?? null,
    metaDescription: row.meta_description ?? row.metaDescription ?? null,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

export function getAllCategories(): Category[] {
  const rows = sqlite.prepare('SELECT * FROM categories ORDER BY sort_order, name').all() as any[];
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  }));
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = sqlite.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as any;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  };
}

export function getAllArticles(options?: { status?: string; limit?: number }): Article[] {
  let sql = 'SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE 1=1';
  const params: any[] = [];
  
  if (options?.status) {
    sql += ' AND a.status = ?';
    params.push(options.status);
  }
  
  sql += ' ORDER BY a.published_at DESC';
  
  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }
  
  const rows = sqlite.prepare(sql).all(...params) as any[];
  return rows.map(row => ({
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function getArticlesByCategory(categoryId: string, options?: { limit?: number }): Article[] {
  let sql = 'SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.category_id = ? AND a.status = ? ORDER BY a.published_at DESC';
  const params: any[] = [categoryId, 'published'];
  
  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }
  
  const rows = sqlite.prepare(sql).all(...params) as any[];
  return rows.map(row => ({
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function getBreakingArticles(): Article[] {
  const rows = sqlite.prepare("SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.is_breaking = 1 AND a.status = 'published' ORDER BY a.published_at DESC LIMIT 5").all() as any[];
  return rows.map(row => ({
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function getLatestArticles(limit: number = 10): Article[] {
  return getAllArticles({ status: 'published', limit });
}

export function getArticleBySlug(slug: string): Article | null {
  const row = sqlite.prepare('SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.slug = ? AND a.status = ?').get(slug, 'published') as any;
  if (!row) return null;
  return {
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  } as Article;
}

export function getRelatedArticles(articleId: string, categoryId: string | null, limit: number = 4): Article[] {
  if (!categoryId) return [];
  const rows = sqlite.prepare('SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.category_id = ? AND a.id != ? AND a.status = ? ORDER BY a.published_at DESC LIMIT ?').all(categoryId, articleId, 'published', limit) as any[];
  return rows.map(row => ({
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function searchArticles(query: string): Article[] {
  const searchTerm = `%${query}%`;
  const rows = sqlite.prepare('SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.status = ? AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?) ORDER BY a.published_at DESC').all('published', searchTerm, searchTerm, searchTerm) as any[];
  return rows.map(row => ({
    ...mapRow(row),
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function getAllImages() {
  return sqlite.prepare('SELECT * FROM images ORDER BY created_at DESC').all();
}

export function getImageById(id: string) {
  return sqlite.prepare('SELECT * FROM images WHERE id = ?').get(id);
}

export default sqlite;
