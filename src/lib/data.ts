import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'news.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
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

export function getAllCategories(): Category[] {
  return sqlite.prepare('SELECT * FROM categories ORDER BY sort_order, name').all() as Category[];
}

export function getCategoryBySlug(slug: string): Category | null {
  return sqlite.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as Category | null;
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
    ...row,
    isBreaking: !!row.is_breaking,
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
    ...row,
    isBreaking: !!row.is_breaking,
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function getBreakingArticles(): Article[] {
  const rows = sqlite.prepare("SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.is_breaking = 1 AND a.status = 'published' ORDER BY a.published_at DESC LIMIT 5").all() as any[];
  return rows.map(row => ({
    ...row,
    isBreaking: !!row.is_breaking,
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
    ...row,
    isBreaking: !!row.is_breaking,
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  } as Article;
}

export function getRelatedArticles(articleId: string, categoryId: string | null, limit: number = 4): Article[] {
  if (!categoryId) return [];
  const rows = sqlite.prepare('SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.category_id = ? AND a.id != ? AND a.status = ? ORDER BY a.published_at DESC LIMIT ?').all(categoryId, articleId, 'published', limit) as any[];
  return rows.map(row => ({
    ...row,
    isBreaking: !!row.is_breaking,
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
  })) as Article[];
}

export function searchArticles(query: string): Article[] {
  const searchTerm = `%${query}%`;
  const rows = sqlite.prepare('SELECT a.*, c.name as category_name, c.slug as category_slug FROM articles a LEFT JOIN categories c ON a.category_id = c.id WHERE a.status = ? AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?) ORDER BY a.published_at DESC').all('published', searchTerm, searchTerm, searchTerm) as any[];
  return rows.map(row => ({
    ...row,
    isBreaking: !!row.is_breaking,
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
